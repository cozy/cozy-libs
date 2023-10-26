import clone from 'lodash/clone'
import get from 'lodash/get'
import merge from 'lodash/merge'

import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'

import manifest from './manifest'
import assert from '../assert'
import {
  hasReachMaxAccountsByKonnector,
  hasReachMaxAccounts
} from '../components/AccountsPaywall/helpers'
import { fetchAccount } from '../connections/accounts'
import {
  buildCountTriggersQuery,
  buildAppsRegistryMaintenance
} from '../helpers/queries'

const DEFAULT_TWOFA_CODE_PROVIDER_TYPE = 'default'

export const TWOFA_PROVIDERS = {
  EMAIL: 'email',
  SMS: 'sms',
  APP_CODE: 'app_code',
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
  [TWOFA_PROVIDERS.APP_CODE]: true,
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

export const updateTwoFAState = (account_, { retry, type }) => {
  const account = clone(account_)
  let state = retry ? 'TWOFA_NEEDED_RETRY' : 'TWOFA_NEEDED'
  if (type === 'email') {
    state += '.EMAIL'
  } else if (type === 'sms') {
    state += '.SMS'
  } else if (type === 'app_code') {
    state += '.APP_CODE'
  } else if (type === 'app') {
    state += '.APP'
  }
  return merge(account, { state, twoFACode: null })
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
  assert(
    konnector.slug,
    'Cannot build an account when the konnector has no slug'
  )
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
  auth: merge({}, account.auth, authData)
})

/**
 * Gets the vault cipher relationship to an account
 * @param  {object} account   io.cozy.accounts document
 * @return {string}           cipher uuid
 */
export const getVaultCipherId = account => {
  const relationshipData = get(account, 'relationships.vaultCipher.data')
  if (!relationshipData) {
    return
  } else if (Array.isArray(relationshipData)) {
    // Support for bug from cipher migration. See link below for context.
    // https://github.com/cozy/cozy-stack/pull/2535#discussion_r433986611
    return relationshipData[0]._id
  } else {
    return relationshipData._id
  }
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
      data: {
        _id: vaultCipherId,
        _type: 'com.bitwarden.ciphers',
        _protocol: 'bitwarden'
      }
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
export const setSessionResetIfNecessary = (account, changedFields = {}) => {
  const isPasswordChanged =
    !!account && !!(changedFields.password || changedFields.passphrase)
  return isPasswordChanged
    ? {
        ...account,
        state: RESET_SESSION_STATE
      }
    : account
}

/**
 * @param {CozyClient} client - Instance of CozyClient
 * @param {string} accountId - id of the account to fetch
 * @param {{ account: 'io.cozy.accounts', trigger: 'io.cozy.triggers' }[]} accountsAndTriggers - list of accounts and triggers
 * @returns {Promise<io.cozy.accounts>} - io.cozy.accounts document
 */
export const loadSelectedAccountId = async (
  client,
  accountId,
  accountsAndTriggers
) => {
  const matchingTrigger = get(
    accountsAndTriggers.find(
      accountAndTrigger => accountAndTrigger.account._id === accountId
    ),
    'trigger'
  )
  if (matchingTrigger) {
    return fetchAccountProcess(client, matchingTrigger)
  } else {
    return null
  }
}

/**
 * @param {CozyClient} client - Instance of CozyClient
 * @param {'io.cozy.triggers'} trigger - io.cozy.triggers document
 * @returns {Promise<io.cozy.accounts>} - io.cozy.accounts document
 */
export const fetchAccountProcess = async (client, trigger) => {
  return fetchAccount(client, triggersModel.getAccountId(trigger))
}

/**
 *
 * @param {string} slug - Slug of the konnector
 * @param {CozyClient} client - Instance of CozyClient
 * @returns {string|null} - Reason for paywall if limit reached otherwise null
 */
export const checkMaxAccounts = async (slug, client) => {
  const triggersQuery = buildCountTriggersQuery()
  const { data: triggers } = await client.fetchQueryAndGetFromState(
    triggersQuery
  )

  const maintenanceQuery = buildAppsRegistryMaintenance()
  const { data: maintenance } = await client.fetchQueryAndGetFromState(
    maintenanceQuery
  )

  const slugInMaintenance = maintenance.map(app =>
    app.maintenance_activated ? app.slug : null
  )

  const activeTrigger = triggers.filter(
    trigger => !slugInMaintenance.includes(trigger.message.konnector)
  )

  const accountCountByKonnector = activeTrigger.reduce(
    (konnectors, current) => {
      const slug = current.message.konnector
      const existingKonnector = konnectors.find(
        konnector => konnector.slug === slug
      )
      if (existingKonnector) {
        existingKonnector.count += 1
      } else {
        konnectors.push({
          slug,
          count: 1
        })
      }
      return konnectors
    },
    []
  )

  if (hasReachMaxAccounts(accountCountByKonnector)) {
    return 'max_accounts'
  }

  if (slugInMaintenance.includes(slug)) {
    return null
  }

  const currentKonnectorTriggers = triggers.filter(
    trigger => trigger.message?.konnector === slug
  )

  if (hasReachMaxAccountsByKonnector(slug, currentKonnectorTriggers.length)) {
    return 'max_accounts_by_konnector'
  }

  return null
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
  getVaultCipherId
}
