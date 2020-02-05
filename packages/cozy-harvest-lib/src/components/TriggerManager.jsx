import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'

import { withMutations, withClient } from 'cozy-client'
import { CozyFolder as CozyFolderClass, Account } from 'cozy-doctypes'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalBackButton } from 'cozy-ui/transpiled/react/Modal'

import { VaultUnlocker, withVaultClient, CipherType } from 'cozy-keys-lib'

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
import HarvestVaultProvider from './HarvestVaultProvider'
import clone from 'lodash/clone'
import flag from 'cozy-flags'
import logger from '../logger'

import { createOrUpdateCipher } from '../models/cipherUtils'
import { konnectorPolicy as biKonnectorPolicy } from '../services/budget-insight'

const defaultKonnectorPolicy = {
  accountContainsAuth: true,
  saveInVault: true,
  onAccountCreation: null,
  match: () => true,
  name: 'default'
}

const policies = [
  flag('bi-konnector-policy') ? biKonnectorPolicy : null,
  defaultKonnectorPolicy
].filter(Boolean)

logger.info('Available konnector policies', policies)

const IDLE = 'IDLE'
const RUNNING = 'RUNNING'

const MODAL_PLACE_ID = 'coz-harvest-modal-place'

const findKonnectorPolicy = konnector => {
  const policy = policies.find(policy => policy.match(konnector))
  logger.info(`Using ${policy.name} konnector policy for ${konnector.slug}`)
  return policy
}

/**
 * Creates or updates an io.cozy.accounts
 * Used as a form submit handler
 *
 * @param  {io.cozy.account} options.account - Existing io.cozy.account or object
 * @param  {Cipher} options.cipher - Vault cipher if vault has been unlocked
 * @param  {CozyClient} options.client - A cozy client
 * @param  {io.cozy.konnector} options.konnector - Konnector to which the account is linked
 * @param  {KonnectorPolicy} options.konnectorPolicy - Controls if auth is saved in io.cozy.accounts
 * and if auth is saved into the vault
 * @param  {function} options.saveAccount
 * @param  {object} options.userData
 * @param  {function} options.ensureTrigger
 */
const createOrUpdateAccount = async ({
  account,
  cipher,
  client,
  konnector,
  konnectorPolicy,
  saveAccount,
  userCredentials
}) => {
  const isUpdate = !!account
  const { onAccountCreation, saveInVault } = konnectorPolicy

  let accountToSave = clone(account)

  accountToSave = accounts.resetState(accountToSave)

  accountToSave = accounts.setSessionResetIfNecessary(
    accountToSave,
    userCredentials
  )

  accountToSave = isUpdate
    ? accounts.mergeAuth(accountToSave, userCredentials)
    : accounts.build(konnector, userCredentials)

  if (onAccountCreation) {
    accountToSave = await onAccountCreation({
      client,
      account: accountToSave,
      konnector,
      saveAccount
    })
  }

  if (cipher && saveInVault) {
    accountToSave = accounts.setVaultCipherRelationship(
      accountToSave,
      cipher.id
    )
  } else {
    logger.warn(
      'No cipher passed when creating/updating account, account will not be linked to cipher'
    )
  }

  return await saveAccount(konnector, accountToSave)
}

/**
 * Wraps conditionally its children inside VaultUnlocker, only if
 * props.konnector's policy tells to saveInVault
 */
const KonnectorVaultUnlocker = ({ konnector, children, ...props }) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)
  if (konnectorPolicy.saveInVault) {
    return <VaultUnlocker {...props}>{children}</VaultUnlocker>
  } else {
    logger.info(
      'Not rendering VaultUnlocker since konnectorPolicy.saveInVault = false'
    )
    return <>{children}</>
  }
}

/**
 * If the vault is not going to be unlocked, we go directly to accountForm
 * step
 * If we need the vault unlocker, the `null` step represents
 *
 * - either vault locked
 * - ciphers being loaded
 *
 * TODO Find a way not to have to check konnectorPolicy here and again through
 * KonnectorVaultUnlocker
 */
const getInitialStep = ({ account, konnector }) => {
  const konnectorPolicy = findKonnectorPolicy(konnector)
  if (konnectorPolicy.saveInVault) {
    return account ? 'accountForm' : null
  } else {
    return 'accountForm'
  }
}

/**
 * Displays the login form and on submission will create the account, triggers and folders.
 * After that it calls TriggerLauncher to run the konnector.
 *
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
      step: getInitialStep(props),
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
    } finally {
      this.setState({ status: IDLE })
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
   * - Ensures a cipher is created for the authentication data
   *   Find cipher via identifier / password
   * - Creates io.cozy.accounts
   * - Links cipher to account
   * - Saves account
   */
  async handleSubmit(data = {}) {
    const { client, konnector, saveAccount, vaultClient } = this.props
    const { account } = this.state

    this.setState({
      error: null,
      status: RUNNING
    })

    try {
      let cipher
      const konnectorPolicy = findKonnectorPolicy(konnector)
      logger.log('konnector policy', konnectorPolicy)
      if (konnectorPolicy.saveInVault) {
        const cipherId = this.getSelectedCipherId()
        cipher = await createOrUpdateCipher(vaultClient, cipherId, {
          account,
          konnector,
          userCredentials: data
        })
      } else {
        logger.info(
          'Bypassing cipher creation because of konnector account policy'
        )
      }

      const savedAccount = await createOrUpdateAccount({
        client,
        account,
        cipher,
        konnector,
        konnectorPolicy,
        saveAccount,
        ensureTrigger: this.ensureTrigger.bind(this),
        userCredentials: data
      })

      return await this.handleNewAccount(accounts.mergeAuth(savedAccount, data))
    } catch (error) {
      return this.handleError(error)
    } finally {
      this.setState({
        status: IDLE
      })
    }
  }

  /**
   * Account creation success handler
   * @param  {Object}  account Created io.cozy.accounts document
   * @return {Object}          io.cozy.jobs document, runned with account data
   */
  async handleNewAccount(account) {
    const trigger = await this.ensureTrigger(account)
    this.setState({ account })
    return await this.props.launch(trigger)
  }
  /**
   * TODO rename state error to accountError
   */
  handleError(error) {
    logger.error('TriggerManager handleError', error)
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

  showCiphersList(ciphers) {
    const newState = { step: 'ciphersList' }

    if (ciphers) {
      newState.ciphers = ciphers
    }

    this.setState(newState)
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
      } else {
        this.showCiphersList(ciphers)
      }
    } catch (err) {
      logger.error(
        `Error while getting decrypted ciphers for ${konnector.slug} konnector:`
      )
      logger.error(err)
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
      <KonnectorVaultUnlocker
        konnector={konnector}
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
                onClick={() => this.showCiphersList()}
                label={t('back')}
              />
            )}
            <AccountForm
              account={
                this.hasCipherSelected()
                  ? this.cipherToAccount(selectedCipher)
                  : account
              }
              error={error || triggerError}
              konnector={konnector}
              onSubmit={this.handleSubmit}
              showError={showError}
              submitting={submitting}
              onBack={() => this.showCiphersList()}
              readOnlyIdentifier={this.hasCipherSelected()}
            />
          </>
        )}
      </KonnectorVaultUnlocker>
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
  onVaultDismiss: PropTypes.func,
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
