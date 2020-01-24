import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'

import { withMutations, withClient } from 'cozy-client'
import { CozyFolder as CozyFolderClass, Account } from 'cozy-doctypes'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import {
  VaultUnlocker,
  withVaultClient,
  CipherType,
  UriMatchType
} from 'cozy-keys-lib'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import AccountForm from './AccountForm'
import OAuthForm from './OAuthForm'
import accountsMutations from '../connections/accounts'
import { triggersMutations } from '../connections/triggers'
import filesMutations from '../connections/files'
import permissionsMutations from '../connections/permissions'
import accounts from '../helpers/accounts'
import cron from '../helpers/cron'
import konnectors from '../helpers/konnectors'
import triggers from '../helpers/triggers'
import TriggerLauncher from './TriggerLauncher'
import VaultCiphersList from './VaultCiphersList'
import manifest from '../helpers/manifest'
import { ModalBackButton } from 'cozy-ui/transpiled/react/Modal'
import HarvestVaultProvider from './HarvestVaultProvider'

const IDLE = 'IDLE'
const RUNNING = 'RUNNING'

const MODAL_PLACE_ID = 'coz-harvest-modal-place'

/**
 * Finds a cipher inside vaultClient from account / konnector / login / password
 *
 * @param {string} searchOptions - Used to find the cipher
 * @param {string} searchOptions.konnector - Used for its vendor link
 * @param {string} searchOptions.account - Used for its cipherId if it exists
 * @param {string} searchOptions.login - Used to match the cipher
 * @param {string} searchOptions.password - Used to match the cipher
 *
 * @returns {Cipher} The cipher or null if no cipher was found
 */
const searchForCipher = async (vaultClient, searchOptions) => {
  const { konnector, account, login, password } = searchOptions
  const konnectorURI = get(konnector, 'vendor_link')

  const id = accounts.getVaultCipherId(account)
  const search = {
    username: login,
    uri: konnectorURI,
    type: CipherType.Login
  }
  const sort = [view => view.login.password === password, 'revisionDate']
  const cipher = await vaultClient.getByIdOrSearch(id, search, sort)
  return cipher || null
}

/**
 * Update a cipher with provided identifier and password
 *
 * @param {string} cipherId - uuid of a cipher
 * @param {string} data.login - the new login
 * @param {string} data.password - the new password
 */
const updateCipher = async (vaultClient, cipherId, data) => {
  const { login, password } = data

  const originalCipher = await vaultClient.getByIdOrSearch(cipherId)
  const cipherData = await vaultClient.decrypt(originalCipher)

  if (
    cipherData.login.username !== login ||
    cipherData.login.password !== password
  ) {
    cipherData.login.username = login
    cipherData.login.password = password

    const newCipher = await vaultClient.createNewCozySharedCipher(
      cipherData,
      originalCipher
    )
    const cipher = await vaultClient.saveCipher(newCipher)
    return cipher
  } else {
    return originalCipher
  }
}

/**
 * Displays the login form and on submission will create the account, triggers and folders.
 * After that it calls TriggerLauncher to run the konnector.
 * @type {Component}
 */
export class DumbTriggerManager extends Component {
  constructor(props) {
    super(props)
    const { account } = props

    this.handleNewAccount = this.handleNewAccount.bind(this)
    this.handleOAuthAccountId = this.handleOAuthAccountId.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleCipherSelect = this.handleCipherSelect.bind(this)
    this.showCiphersList = this.showCiphersList.bind(this)
    this.handleVaultUnlock = this.handleVaultUnlock.bind(this)

    this.state = {
      account,
      error: null,
      status: IDLE,
      step: account ? 'accountForm' : 'ciphersList',
      selectedCipher: undefined,
      showBackButton: false,
      ciphers: []
    }
  }

  componentDidMount() {
    this.CozyFolder = CozyFolderClass.copyWithClient(this.props.client)
  }

  /**
   * Ensure that a trigger will exist, with valid destination folder with
   * permissions and references
   * TODO move this to Cozy-Doctypes https://github.com/cozy/cozy-libs/issues/743
   *
   * @param  {object}  account
   * @return {Object} Trigger document
   */
  async ensureTrigger(account) {
    const {
      addPermission,
      addReferencesTo,
      createDirectoryByPath,
      createTrigger,
      statDirectoryByPath,
      konnector,
      t
    } = this.props

    const { trigger } = this.props
    if (trigger) {
      return trigger
    }

    let folder

    if (konnectors.needsFolder(konnector)) {
      const [adminFolder, photosFolder] = await Promise.all([
        this.CozyFolder.ensureMagicFolder(
          this.CozyFolder.magicFolders.ADMINISTRATIVE,
          `/${t('folder.administrative')}`
        ),
        this.CozyFolder.ensureMagicFolder(
          this.CozyFolder.magicFolders.PHOTOS,
          `/${t('folder.photos')}`
        )
      ])

      const path = konnectors.buildFolderPath(konnector, account, {
        administrative: adminFolder.path,
        photos: photosFolder.path
      })

      folder =
        (await statDirectoryByPath(path)) || (await createDirectoryByPath(path))

      await addPermission(konnector, konnectors.buildFolderPermission(folder))
      await addReferencesTo(konnector, [folder])
    }

    return await createTrigger(
      triggers.buildAttributes({
        account,
        cron: cron.fromKonnector(konnector),
        folder,
        konnector
      })
    )
  }

  /**
   * OAuth Form success handler. OAuthForm retrieves an account id created by the
   * cozy stack
   * @param  {string}  accountId
   */
  async handleOAuthAccountId(accountId) {
    const { findAccount } = this.props
    try {
      this.setState({ error: null, status: RUNNING })
      const oAuthAccount = await findAccount(accountId)
      return await this.handleNewAccount(oAuthAccount)
    } catch (error) {
      this.handleError(error)
    }
  }

  /**
   * Get the ID of the cipher selected by the user in the list
   *
   * @returns {string|null} the cipher ID
   */
  getSelectedCipherId() {
    const { selectedCipher } = this.state
    return selectedCipher && selectedCipher.id
  }

  /**
   * Create a new cipher and return its ID
   *
   * @param {string} login - the login to register in the new cipher
   * @param {string} password - the password to register in the new cipher
   *
   * @returns {string} the cipher ID
   */
  async createNewCipherId(login, password) {
    const { vaultClient, konnector } = this.props

    const konnectorURI = get(konnector, 'vendor_link')
    const konnectorName = get(konnector, 'name') || get(konnector, 'slug')

    const cipherData = {
      id: null,
      type: CipherType.Login,
      name: konnectorName,
      login: {
        username: login,
        password,
        uris: konnectorURI
          ? [{ uri: konnectorURI, match: UriMatchType.Domain }]
          : []
      }
    }

    const cipher = await vaultClient.createNewCozySharedCipher(cipherData, null)
    await vaultClient.saveCipher(cipher)

    return cipher.id
  }

  /**
   * Share a cipher to the cozy org
   * @param {string} cipherId - uuid of a cipher
   */
  async shareCipherWithCozy(cipherId) {
    const { vaultClient } = this.props
    const cipher = await vaultClient.get(cipherId)
    const cipherView = await vaultClient.decrypt(cipher)
    await vaultClient.shareWithCozy(cipherView)
  }

  /**
   * TODO move to AccountHelper
   */
  async handleSubmit(data = {}) {
    const { konnector, saveAccount, vaultClient } = this.props

    const { account } = this.state
    const isUpdate = !!account

    this.setState({
      error: null,
      status: RUNNING
    })

    const identifierProperty = manifest.getIdentifier(konnector.fields)

    const isVaultLocked = await vaultClient.isLocked()

    try {
      const identifier = data[identifierProperty]
      const password = data.password
      let cipherId = this.getSelectedCipherId()

      if (isVaultLocked) {
        // eslint-disable-next-line no-console
        console.warn(
          'Impossible to manage ciphers since vault is locked. The created io.cozy.accounts will not be linked to an com.bitwarden.ciphers'
        )
      } else {
        if (cipherId) {
          await updateCipher(vaultClient, cipherId, identifier, password)
        } else {
          const existingCipher = await searchForCipher(vaultClient, {
            account,
            konnector,
            login: identifier,
            password
          })
          if (existingCipher) {
            cipherId = existingCipher.id
            await updateCipher(vaultClient, cipherId, identifier, password)
          } else {
            cipherId = await this.createNewCipherId(identifier, password)
          }
        }

        await this.shareCipherWithCozy(cipherId)
      }

      const accountWithNewState = accounts.setSessionResetIfNecessary(
        accounts.resetState(account),
        data
      )
      const accountDocument = isUpdate
        ? accounts.mergeAuth(accountWithNewState, data)
        : accounts.build(konnector, data)

      let accountToSave

      if (cipherId) {
        accountToSave = accounts.setVaultCipherRelationship(
          accountDocument,
          cipherId
        )
      } else {
        accountToSave = accountDocument
      }

      const savedAccount = accounts.mergeAuth(
        await saveAccount(konnector, accountToSave),
        data
      )
      return await this.handleNewAccount(savedAccount)
    } catch (error) {
      return this.handleError(error)
    }
  }

  /**
   * Account creation success handler
   * @param  {Object}  account Created io.cozy.accounts document
   * @return {Object}          io.cozy.jobs document, runned with account data
   */
  async handleNewAccount(account) {
    const trigger = await this.ensureTrigger(account)
    this.setState({ account, status: IDLE })
    return await this.props.launch(trigger)
  }
  /**
   * TODO rename state error to accountError
   */
  handleError(error) {
    const { onError } = this.props
    this.setState({ error })
    if (typeof onError === 'function') onError(error)
  }

  handleCipherSelect(selectedCipher) {
    const { konnector } = this.props
    const account = this.cipherToAccount(selectedCipher)
    const values = manifest.getFieldsValues(konnector, account)

    const hasValuesForRequiredFields = manifest.hasValuesForRequiredFields(
      konnector,
      values
    )

    if (hasValuesForRequiredFields) {
      this.setState(
        {
          selectedCipher
        },
        () => {
          this.handleSubmit(values)
        }
      )
    } else {
      this.setState({
        step: 'accountForm',
        selectedCipher,
        showBackButton: true
      })
    }
  }

  showCiphersList() {
    this.setState({
      step: 'ciphersList'
    })
  }

  cipherToAccount(cipher) {
    if (cipher === undefined) {
      return null
    }

    const identifierProperty = manifest.getIdentifier(
      this.props.konnector.fields
    )

    const account = Account.fromCipher(cipher, {
      identifierProperty
    })

    return account
  }

  componentDidUpdate(prevProps) {
    if (this.props.error && this.props.error !== prevProps.error) {
      this.setState({ step: 'accountForm' })
    }
  }

  /**
   * Tells whether we currently have a cipher selected or not
   * selectedCipher === undefined means nothing has been selected
   * selectedCipher === null means « from another account has been selected »
   * selectedCipher === Object means a cipher has been selected
   */
  hasCipherSelected() {
    return this.state.selectedCipher !== undefined
  }

  showAccountForm() {
    this.setState({ step: 'accountForm', showBackButton: false })
  }

  async handleVaultUnlock() {
    const { vaultClient, konnector } = this.props

    const encryptedCiphers = await vaultClient.getAll({
      type: CipherType.Login
    })

    if (encryptedCiphers.length === 0) {
      this.showAccountForm()
      return
    }

    try {
      const ciphers = await vaultClient.getAllDecrypted({
        type: CipherType.Login,
        uri: get(konnector, 'vendor_link')
      })

      if (ciphers.length === 0) {
        this.showAccountForm()
      }

      this.setState({ ciphers })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `Error while getting decrypted ciphers for ${konnector.slug} konnector:`
      )
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  render() {
    const {
      error: triggerError,
      konnector,
      running: triggerRunning,
      showError,
      modalContainerId,
      t,
      onVaultDismiss,
      vaultClosable
    } = this.props

    const {
      account,
      error,
      status,
      step,
      selectedCipher,
      showBackButton,
      ciphers
    } = this.state

    const submitting = !!(status === RUNNING || triggerRunning)
    const modalInto = modalContainerId || MODAL_PLACE_ID

    const { oauth } = konnector

    const showSpinner = submitting && selectedCipher && step === 'ciphersList'
    const showCiphersList = step === 'ciphersList'
    const showAccountForm = step === 'accountForm'

    if (oauth) {
      return (
        <OAuthForm
          account={account}
          konnector={konnector}
          onSuccess={this.handleOAuthAccountId}
          submitting={submitting}
        />
      )
    }

    if (showSpinner) {
      return (
        <div className="u-flex u-flex-column u-flex-items-center">
          <Spinner size="xxlarge" />
          <p>{t('triggerManager.connecting')}</p>
        </div>
      )
    }

    return (
      <VaultUnlocker
        onDismiss={onVaultDismiss}
        closable={vaultClosable}
        onUnlock={this.handleVaultUnlock}
      >
        <div id={modalInto} />
        {showCiphersList && (
          <VaultCiphersList
            konnector={konnector}
            ciphers={ciphers}
            onSelect={this.handleCipherSelect}
          />
        )}
        {showAccountForm && (
          <>
            {showBackButton && (
              <ModalBackButton
                onClick={this.showCiphersList}
                label={t('back')}
              />
            )}
            <AccountForm
              account={
                !this.hasCipherSelected()
                  ? account
                  : this.cipherToAccount(selectedCipher)
              }
              error={error || triggerError}
              konnector={konnector}
              onSubmit={this.handleSubmit}
              showError={showError}
              submitting={submitting}
              onBack={this.showCiphersList}
              readOnlyIdentifier={this.hasCipherSelected()}
            />
          </>
        )}
      </VaultUnlocker>
    )
  }
}

DumbTriggerManager.propTypes = {
  /**
   * Account document. Used to get intial form values.
   * If no account is passed, AccountForm will use empty initial values.
   * @type {Object}
   */
  account: PropTypes.object,
  /**
   * Konnector document. AccountForm will check the `fields` object to compute
   * fields.
   * @type {Object}
   */
  konnector: PropTypes.object.isRequired,
  /**
   * Indicates if the TriggerManager has to show errors. Sometimes errors may be
   * displayed elsewhere. However, a KonnectorJobError corresponding to a login
   * error is always displayed. Transmitted to AccountForm.
   * @type {Boolean}
   */
  showError: PropTypes.bool,
  /**
   * Existing trigger document to manage.
   * @type {Object}
   */
  trigger: PropTypes.object,
  /**
   * Indicates if the given trigger is already running, i.e. if it has been
   * launched and if an associated job with status 'running' exists.
   * @type {[type]}
   */
  running: PropTypes.bool,
  /**
   * The current error for the job (string or KonnectorJob error)
   */
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /**
   * Function to call to launch the job
   */
  launch: PropTypes.func.isRequired,
  /**
   * Translation function
   */
  t: PropTypes.func,
  //
  // mutations
  //
  /**
   * Permission mutation
   * @type {Function}
   */
  addPermission: PropTypes.func,
  /**
   * File mutation
   * @type {Function}
   */
  addReferencesTo: PropTypes.func,
  /**
   * Trigger mutation
   * @type {Function}
   */
  createTrigger: PropTypes.func.isRequired,
  /**
   * Trigger mutations
   * @type {Function}
   */
  createDirectoryByPath: PropTypes.func,
  /**
   * Account Mutation, used to retrieve OAuth account
   * @type {Function}
   */
  findAccount: PropTypes.func,
  /**
   * Account mutation
   * @type {Func}
   */
  saveAccount: PropTypes.func.isRequired,
  /**
   * Trigger mutations
   * @type {Function}
   */
  statDirectoryByPath: PropTypes.func,
  /**
   * What to do when the Vault unlock screen is dismissed without password
   */
  onVaultDismiss: PropTypes.func.isRequired,
  /**
   * Whether the vault will be closable or not.
   * @type {Boolean}
   */
  vaultClosable: PropTypes.bool
}

const SmartTriggerManager = flow(
  translate(),
  withClient,
  withVaultClient,
  withMutations(
    accountsMutations,
    filesMutations,
    permissionsMutations,
    triggersMutations
  )
)(DumbTriggerManager)

// The TriggerManager is wrapped in the providers required for it to work by
// itself instead of receiving it from its parents because it is used as
// standalone in places like cozy-home intents
export const TriggerManager = props => {
  return (
    <HarvestVaultProvider>
      <MuiCozyTheme>
        <SmartTriggerManager {...props} />
      </MuiCozyTheme>
    </HarvestVaultProvider>
  )
}

// TriggerManager is exported wrapped in TriggerLauncher to avoid breaking changes.
const LegacyTriggerManager = props => {
  const {
    onLaunch,
    onSuccess,
    onLoginSuccess,
    onError,
    initialTrigger,
    ...otherProps
  } = props
  return (
    <TriggerLauncher
      onLaunch={onLaunch}
      onSuccess={onSuccess}
      onLoginSuccess={onLoginSuccess}
      onError={onError}
      initialTrigger={initialTrigger}
    >
      {({ error, launch, running, trigger }) => (
        <TriggerManager
          {...otherProps}
          error={error}
          launch={launch}
          running={running}
          trigger={trigger}
        />
      )}
    </TriggerLauncher>
  )
}

export default LegacyTriggerManager
