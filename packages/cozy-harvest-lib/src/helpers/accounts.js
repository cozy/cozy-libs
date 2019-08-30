import get from 'lodash/get'
import merge from 'lodash/merge'

import manifest from './manifest'

const DEFAULT_TWOFA_CODE_PROVIDER_TYPE = 'default'

export const TWOFA_PROVIDERS = {
  EMAIL: 'email',
  SMS: 'sms',
  APP: 'app'
}

// For some 2FA modes, we do not need user input, this is for example the
// case for the "app" two fa where the user will open the website/app of the
// provider and click on a notification or a button. For those modes, we
// does not need to show an input field with a submit button. We only have
// to wait, the konnector should tell us when everything is OK.
export const TWOFA_USER_INPUT = {
  default: true,
  [TWOFA_PROVIDERS.EMAIL]: true,
  [TWOFA_PROVIDERS.SMS]: true,
  [TWOFA_PROVIDERS.APP]: false
}

const TWOFA_NEEDED_STATUS = 'TWOFA_NEEDED'
const TWOFA_NEEDED_RETRY_STATUS = 'TWOFA_NEEDED_RETRY'
const RESET_SESSION_STATE = 'RESET_SESSION'
const HANDLE_LOGIN_SUCCESS_STATE = 'HANDLE_LOGIN_SUCCESS'
const LOGIN_SUCCESS_STATE = 'LOGIN_SUCCESS'

/**
 * Return a boolean to know if the account is in a two fa code needed
 * status
 * @param  {String}  status Account two FA Status
 * @return {Boolean}
 */
export const isTwoFANeeded = status => {
  if (!status) return false
  return status.split('.')[0] === TWOFA_NEEDED_STATUS
}

export const isTwoFARetry = status => {
  if (!status) return false
  return status.split('.')[0] === TWOFA_NEEDED_RETRY_STATUS
}

export const isLoginSuccessHandled = status => {
  return status === HANDLE_LOGIN_SUCCESS_STATE
}

export const isLoginSuccess = status => {
  return status === LOGIN_SUCCESS_STATE
}

/**
 * Return the status object key matching the status value
 * @param  {String} status Account document
 * @return {String}        Two FA Code providing type or default one if not known
 */
export const getTwoFACodeProvider = account => {
  if (!account || !account.state) return DEFAULT_TWOFA_CODE_PROVIDER_TYPE
  const codeParts = account.state ? account.state.split('.') : []
  if (codeParts.length > 1) {
    return TWOFA_PROVIDERS[codeParts[1]] || DEFAULT_TWOFA_CODE_PROVIDER_TYPE
  } else {
    return DEFAULT_TWOFA_CODE_PROVIDER_TYPE
  }
}

/**
 * Returns the label for the given account.
 * This label is by default the value for the identifier field.
 * If there is no value for this field, the label is the io.cozy.accounts
 * document id.
 * @param  {Object} account io.cozy.accounts documents
 * @return {string}         The label associated to this account.
 */
export const getLabel = account =>
  get(account, `auth.${account.identifier}`) || account._id

/**
 * Transforms AccountForm data to io.cozy.accounts document
 * @param  {object} konnector Konnector related to account
 * @param  {object} data      Data from AccountForm
 * @return {object}           io.cozy.accounts attributes
 */
export const build = (konnector, authData) => {
  // We are not at the final target for io.cozy.accounts.
  // For now we are just ensuring legacy
  return {
    auth: authData,
    account_type: konnector.slug,
    identifier: manifest.getIdentifier(konnector.fields),
    state: null
  }
}

/**
 * Merges existing io.cozy.accounts auth with Auth data from AccountForm
 * @param  {object} account   io.cozy.accounts document
 * @param  {object} data      Data from AccountForm
 * @return {object}           io.cozy.accounts attributes
 */
export const mergeAuth = (account, authData) => ({
  ...account,
  auth: merge(account.auth, authData)
})

/**
 * Gets the vault cipher relationship to an account
 * @param  {object} account   io.cozy.accounts document
 * @return {string}           cipher uuid
 */
export const getVaultCipherId = (account) => account.relationships && account.relationships.vaultCipher && account.relationships.vaultCipher._id

/**
 * Gets the linked cipher in vault
 * If none is linked, search on that match
 * @param account - io.cozy.accounts document
 * @param {WebVaultClient} vaultClient
 * @param {object} search criterias
 * @param {string} search.username
 * @param {string} search.password
 * @param {string} search.uri
 * @return {CipherView|null}
 */
export const getVaultCipher = async (account, vaultClient, {username, password, uri}={}) => {
  const id = getVaultCipherId(account)
  if (id) {
    // there is an explicit existing link
    const cipher = await vaultClient.get(id)
    if (cipher) return cipher
  }
  if (login && uri) {
    // there is no link or the link is broken
    // but there may be a existing cipher with the same credentials
    const type = vaultClient.cipherTypes.Login
    const search = { type, username, uri }
    const all = vaultClient.getAllDecryptedFor(search)
    if (all.length > 0) {
      const all = all.find(v => v.login.password == password)
      const first = all[0]
      const id = (all || first).id
      const cipher = await vaultClient.get(id)
      return cipher
    }
  }
  return null
}

/**
 * Adds or updates a vault cipher relationship to an account
 * @param  {object} account   io.cozy.accounts document
 * @param  {string} vaultCipherId The id of the cipher mathcing this account in the vault
 * @return {object}           io.cozy.accounts attributes
 */
export const setVaultCipherRelationship = (account, vaultCipherId) => ({
  ...account,
  relationships: {
    ...account.relationships,
    vaultCipher: {
      _id: vaultCipherId,
      _type: 'com.bitwarden.ciphers',
      _protocol: 'bitwarden'
    }
  }
})

/**
 * Update Two FA code from TwoFAForm into io.cozy.accounts document
 * @param  {object} account   io.cozy.accounts document
 * @param  {object} code      Code from TwoFAForm
 * @return {object}           io.cozy.accounts attributes
 */
export const updateTwoFaCode = (account, code) => ({
  // reset the state since the konnector is listening it
  ...resetState(account),
  twoFACode: code
})

/**
 * Reset the account state
 * @param  {Object} account Account document
 * @return {object}         Changed account document
 */
export const resetState = account => ({
  ...account,
  state: null
})

/**
 * Set a state to reset the konnector session into io.cozy.accounts document
 * only if necessary, if password/passphrase have changed
 * @param  {object} account   io.cozy.accounts document
 * @return {object}           io.cozy.accounts updated document
 */
export const setSessionResetIfNecessary = (account, changedFields) => {
  const isPasswordChanged =
    !!account && !!(changedFields.password || changedFields.passphrase)
  return isPasswordChanged
    ? {
        ...account,
        state: RESET_SESSION_STATE
      }
    : account
}

export default {
  build,
  getLabel,
  getTwoFACodeProvider,
  isTwoFANeeded,
  isTwoFARetry,
  isLoginSuccess,
  isLoginSuccessHandled,
  mergeAuth,
  resetState,
  setSessionResetIfNecessary,
  updateTwoFaCode,
  setVaultCipherRelationship,
  getVaultCipherId,
  findCipher
}
