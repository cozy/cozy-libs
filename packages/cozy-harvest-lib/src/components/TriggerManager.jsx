import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import flow from 'lodash/flow'

import { withMutations, withClient } from 'cozy-client'
import { CozyFolder as CozyFolderClass } from 'cozy-doctypes'
import { translate } from 'cozy-ui/transpiled/react/I18n'
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
import BackButton from './BackButton'

const IDLE = 'IDLE'
const RUNNING = 'RUNNING'

const MODAL_PLACE_ID = 'coz-harvest-modal-place'

/**
 * Displays the login form and on submission will create the account, triggers and folders.
 * After that it calls TriggerLauncher to run the konnector.
 * @type {Component}
 */
export class TriggerManager extends Component {
  constructor(props) {
    super(props)
    const { account } = props

    this.handleNewAccount = this.handleNewAccount.bind(this)
    this.handleOAuthAccountId = this.handleOAuthAccountId.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleCipherSelect = this.handleCipherSelect.bind(this)
    this.showCiphersList = this.showCiphersList.bind(this)

    this.state = {
      account,
      error: null,
      status: IDLE,
      step: 'ciphersList'
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

    try {
      const { login, password } = data
      const konnectorURI = get(konnector, 'vendor_link')
      const konnectorName = get(konnector, 'name') || get(konnector, 'slug')

      let originalCipher = null
      if (isUpdate) {
        const id = accounts.getVaultCipherId(account)
        const search = {
          username: login,
          uri: konnectorURI,
          type: CipherType.Login
        }
        const sort = [view => view.login.password === password, 'revisionDate']
        originalCipher = await vaultClient.getByIdOrSearch(id, search, sort)
      }

      let cipherData
      if (originalCipher) {
        cipherData = await vaultClient.decrypt(originalCipher)
        cipherData.login.username = login
        cipherData.login.password = password
      } else {
        cipherData = {
          id: null,
          type: 1,
          name: konnectorName,
          login: {
            username: login,
            password,
            uris: konnectorURI ? [{ uri: konnectorURI, match: 0 }] : []
          }
        }
      }

      const cipher = await vaultClient.createNewCipher(
        cipherData,
        originalCipher || null
      )
      await vaultClient.saveCipher(cipher)

      const accountWithNewState = accounts.setSessionResetIfNecessary(
        accounts.resetState(account),
        data
      )
      const accountDocument = isUpdate
        ? accounts.mergeAuth(accountWithNewState, data)
        : accounts.build(konnector, data)
      const accountToSave = accounts.setVaultCipherRelationship(
        accountDocument,
        cipher.id
      )
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

  handleCipherSelect() {
    this.setState({
      step: 'accountForm'
    })
  }

  showCiphersList() {
    this.setState({
      step: 'ciphersList'
    })
  }

  render() {
    const {
      error: triggerError,
      konnector,
      running: triggerRunning,
      showError,
      modalContainerId,
      t,
      onVaultDismiss
    } = this.props
    const { account, error, status, step } = this.state
    const submitting = !!(status === RUNNING || triggerRunning)
    const modalInto = modalContainerId || MODAL_PLACE_ID

    const { oauth } = konnector

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

    return (
      <div>
        <VaultUnlocker onDismiss={onVaultDismiss}>
          <div id={modalInto} />
          {step === 'ciphersList' && (
            <VaultCiphersList
              konnector={konnector}
              onSelect={this.handleCipherSelect}
            />
          )}
          {step === 'accountForm' && (
            <>
              <BackButton onClick={this.showCiphersList}>
                {t('triggerManager.backToCiphersList')}
              </BackButton>
              <AccountForm
                account={account}
                error={error || triggerError}
                konnector={konnector}
                onSubmit={this.handleSubmit}
                showError={showError}
                submitting={submitting}
              />
            </>
          )}
        </VaultUnlocker>
      </div>
    )
  }
}

TriggerManager.propTypes = {
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
  onVaultDismiss: PropTypes.func.isRequired
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
)(TriggerManager)

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
        <SmartTriggerManager
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
