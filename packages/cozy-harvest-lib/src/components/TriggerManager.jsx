import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import compose from 'lodash/flowRight'

import { withClient } from 'cozy-client'
import { Account } from 'cozy-doctypes'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalBackButton } from 'cozy-ui/transpiled/react/Modal'

import {
  CipherType,
  withVaultUnlockContext,
  VaultUnlockPlaceholder,
  VaultUnlockProvider,
  CozyUtils
} from 'cozy-keys-lib'

import AccountForm from './AccountForm'
import OAuthForm from './OAuthForm'
import { fetchAccount } from '../connections/accounts'
import FlowProvider from './FlowProvider'
import VaultCiphersList from './VaultCiphersList'
import manifest from '../helpers/manifest'
import logger from '../logger'
import { findKonnectorPolicy } from '../konnector-policies'
import withConnectionFlow from '../models/withConnectionFlow'
import HarvestVaultProvider from './HarvestVaultProvider'
import { intentsApiProptype } from '../helpers/proptypes'

const IDLE = 'IDLE'
const RUNNING = 'RUNNING'

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
 * After that it calls FlowProvider to run the konnector.
 *
 * @type {Component}
 */
export class DumbTriggerManager extends Component {
  constructor(props) {
    super(props)
    const { account } = props

    this.handleOAuthAccountId = this.handleOAuthAccountId.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleCipherSelect = this.handleCipherSelect.bind(this)
    this.showCiphersList = this.showCiphersList.bind(this)
    this.handleVaultUnlock = this.handleVaultUnlock.bind(this)

    this.state = {
      account,
      error: null,
      step: getInitialStep(props),
      selectedCipher: undefined,
      showBackButton: false,
      ciphers: []
    }
  }

  /**
   * OAuth Form success handler. OAuthForm retrieves an account id created by the
   * cozy stack
   * @param  {string}  accountId
   */
  async handleOAuthAccountId(accountId) {
    const { client, flow, konnector, t, reconnect } = this.props
    let oAuthAccount = reconnect
      ? flow.account
      : await fetchAccount(client, accountId)

    const konnectorPolicy = findKonnectorPolicy(konnector)

    let foundOAuthConnection = false
    if (konnectorPolicy.handleOAuthAccount) {
      foundOAuthConnection = await konnectorPolicy.handleOAuthAccount({
        account: oAuthAccount,
        flow,
        konnector,
        client,
        reconnect,
        t
      })
    }

    // for "normal" OAuth connectors
    if (!foundOAuthConnection) {
      flow.ensureTriggerAndLaunch(client, {
        account: oAuthAccount,
        konnector: konnector,
        trigger: flow.trigger,
        t
      })
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

  async handleSubmit(data = {}) {
    const { client, flow, konnector, vaultClient, t } = this.props
    const { account } = this.state

    this.setState({
      error: null,
      status: RUNNING
    })

    try {
      const cipherId = this.getSelectedCipherId()
      await flow.handleFormSubmit({
        client,
        account,
        cipherId,
        konnector,
        trigger: flow.trigger,
        userCredentials: data,
        vaultClient,
        t
      })
    } catch (error) {
      return this.handleError(error)
    } finally {
      this.setState({
        status: IDLE
      })
    }
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

  async componentDidMount() {
    const {
      konnector,
      showUnlockForm,
      onVaultDismiss,
      vaultClosable,
      vaultClient,
      client
    } = this.props
    const konnectorPolicy = findKonnectorPolicy(konnector)
    if (konnectorPolicy.saveInVault) {
      if (!vaultClient) {
        throw new Error(
          'Konnector policy `saveInVault` is true, but no vault has been passed in the context of the TriggerManager. You can wrap it the TriggerManager in a VaultUnlockProvider or VaultProvider (from cozy-keys-lib).'
        )
      }
      const isVaultLocked = await vaultClient.isLocked()
      if (isVaultLocked) {
        showUnlockForm({
          onDismiss: onVaultDismiss,
          closable: vaultClosable,
          onUnlock: this.handleVaultUnlock,
          addCheckShouldUnlock: () =>
            CozyUtils.checkHasInstalledExtension(client)
        })
      } else {
        this.handleVaultUnlock()
      }
    } else {
      this.showAccountForm()
    }
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

    // If the vault has not been setup, it is still locked
    // here, since the unlock form has not been shown to
    // the user.
    const isLocked = await vaultClient.isLocked()
    if (isLocked) {
      this.showAccountForm()
      return
    }

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
        if (this.state.step === 'accountForm') {
          this.setState({ ciphers })
        } else {
          this.showCiphersList(ciphers)
        }
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
      konnector,
      showError,
      t,
      fieldOptions,
      flow,
      flowState,
      client,
      OAuthFormWrapperComp,
      OAuthFormWrapperCompProps = {},
      reconnect,
      intentsApi
    } = this.props

    const submitting = flowState.running

    const { account, step, selectedCipher, showBackButton, ciphers } =
      this.state

    const { oauth } = konnector

    const showSpinner = submitting && selectedCipher && step === 'ciphersList'
    const showCiphersList = step === 'ciphersList'
    const showAccountForm = step === 'accountForm'
    const konnectorPolicy = findKonnectorPolicy(konnector)

    if (oauth || konnectorPolicy.isBIWebView) {
      const Wrapper = OAuthFormWrapperComp
        ? OAuthFormWrapperComp
        : React.Fragment
      return (
        <Wrapper {...OAuthFormWrapperCompProps}>
          <OAuthForm
            client={client}
            flow={flow}
            account={account}
            reconnect={reconnect}
            konnector={konnector}
            onSuccess={this.handleOAuthAccountId}
            intentsApi={intentsApi}
          />
        </Wrapper>
      )
    }

    if (showSpinner) {
      return (
        <div className="u-flex u-flex-column u-flex-items-center u-pv-2">
          <Spinner size="xxlarge" />
          <p>{t('triggerManager.connecting')}</p>
        </div>
      )
    }

    return (
      <>
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
              flow={flow}
              konnector={konnector}
              onSubmit={this.handleSubmit}
              showError={showError}
              onBack={() => this.showCiphersList()}
              readOnlyIdentifier={this.hasCipherSelected()}
              fieldOptions={fieldOptions}
            />
          </>
        )}
      </>
    )
  }
}

DumbTriggerManager.propTypes = {
  /**
   * Account document. Used to get initial form values.
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
  t: PropTypes.func,
  /**
   * What to do when the Vault unlock screen is dismissed without password
   */
  onVaultDismiss: PropTypes.func,
  /**
   * Whether the vault will be closable or not.
   * @type {Boolean}
   */
  vaultClosable: PropTypes.bool,
  /**
   *
   */
  vaultClient: PropTypes.object,
  client: PropTypes.object,
  onError: PropTypes.func,
  showUnlockForm: PropTypes.func,
  error: PropTypes.any,
  /**
   * Used to have options on fields (forceEncryptedPlaceholder or focus)
   */
  fieldOptions: PropTypes.object,
  flow: PropTypes.object,
  flowState: PropTypes.object,
  /** Used to inject a component around OAuthForm, and so customize the UI from the app */
  OAuthFormWrapperComp: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func
  ]),
  /** Is it a reconnection or not */
  reconnect: PropTypes.bool,
  // custom intents api. Can have fetchSessionCode, showInAppBrowser, closeInAppBrowser at the moment
  intentsApi: intentsApiProptype
}

const TriggerManager = compose(
  translate(),
  withClient,
  withVaultUnlockContext,
  withConnectionFlow()
)(DumbTriggerManager)

// TriggerManager is exported wrapped in FlowProvider to avoid breaking changes.
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
    <FlowProvider
      onLaunch={onLaunch}
      onSuccess={onSuccess}
      onLoginSuccess={onLoginSuccess}
      onError={onError}
      initialTrigger={initialTrigger}
    >
      {({ flow }) => (
        <TriggerManager
          {...otherProps}
          error={flow.getState().error}
          flow={flow}
        />
      )}
    </FlowProvider>
  )
}

export const IntentTriggerManager = ({ vaultUnlockFormProps, ...props }) => {
  return (
    <HarvestVaultProvider>
      <VaultUnlockProvider>
        <LegacyTriggerManager {...props} />
        <VaultUnlockPlaceholder unlockFormProps={vaultUnlockFormProps} />
      </VaultUnlockProvider>
    </HarvestVaultProvider>
  )
}

export default LegacyTriggerManager
