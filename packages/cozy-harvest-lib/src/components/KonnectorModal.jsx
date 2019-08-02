import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Button from 'cozy-ui/transpiled/react/Button'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { SubTitle } from 'cozy-ui/transpiled/react/Text'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import DeleteAccountCard from './cards/DeleteAccountCard'
import LaunchTriggerCard from './cards/LaunchTriggerCard'
import TriggerErrorInfo from './infos/TriggerErrorInfo'
import withLocales from './hoc/withLocales'
import SelectBox from 'cozy-ui/transpiled/react/SelectBox'

/**
 * KonnectorModal open a Modal related to a given konnector. It fetches the
 * first account and then include a TriggerManager component.
 *
 * This component is aimed to offer an UI to manage all the konnector related
 * triggers and accounts.
 */
export class KonnectorModal extends PureComponent {
  state = {
    account: null,
    fetching: true,
    trigger: null,
    accounts: [],
    selectedAccount: null
  }

  constructor(props) {
    super(props)
    this.fetchIcon = this.fetchIcon.bind(this)
    this.handleKonnectorJobError = this.handleKonnectorJobError.bind(this)
    this.handleKonnectorJobSuccess = this.handleKonnectorJobSuccess.bind(this)
    this.handleTriggerLaunch = this.handleTriggerLaunch.bind(this)
  }

  componentDidMount() {
    this.fetchAccount(this.props.konnector.triggers.data[0])
    this.fetchAccounts()
  }

  componentWillUnmount() {
    const { into } = this.props
    if (!into) return
    // The Modal is never closed after a dismiss on Preact apps, even if it is
    // not rendered anymore. The best hack we found is to explicitly empty the
    // modal portal container.
    setTimeout(() => {
      try {
        const modalRoot = document.querySelector(into)
        modalRoot.innerHTML = ''
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }, 50)
  }
  async fetchAccounts() {
    const triggers = this.props.konnector.triggers.data
    const { findAccount } = this.props
    const accounts = await Promise.all(
      triggers.map(async trigger => {
        return {
          account: await findAccount(triggersModel.getAccountId(trigger)),
          trigger
        }
      })
    )
    this.setState({ accounts })
  }
  async fetchAccount(trigger) {
    const { findAccount } = this.props
    this.setState({ fetching: true })

    try {
      const account = await findAccount(triggersModel.getAccountId(trigger))
      this.setState({
        account,
        trigger,
        konnectorJobError: triggersModel.getError(trigger)
      })
    } catch (error) {
      this.setState({
        error
      })
    } finally {
      this.setState({
        fetching: false
      })
    }
  }

  fetchIcon() {
    const { client } = this.context
    const { konnector } = this.props
    return client.stackClient.getIconURL({
      type: 'konnector',
      slug: konnector.slug
    })
  }

  handleKonnectorJobError(konnectorJobError) {
    this.setState({
      konnectorJobError,
      isJobRunning: false
    })

    this.refetchTrigger()
  }

  handleKonnectorJobSuccess(trigger) {
    this.setState({ isJobRunning: false, trigger })
    this.refetchTrigger()
  }

  handleTriggerLaunch() {
    this.setState({ isJobRunning: true, konnectorJobError: null })
  }

  async refetchTrigger() {
    const { fetchTrigger } = this.props
    const { trigger } = this.state

    const upToDateTrigger = await fetchTrigger(trigger._id)
    this.setState({
      trigger: upToDateTrigger
    })
  }

  render() {
    const { dismissAction, konnector, into, t } = this.props

    const {
      account,
      error,
      fetching,
      isJobRunning,
      konnectorJobError,
      trigger,
      accounts
    } = this.state

    return (
      <Modal
        dismissAction={dismissAction}
        mobileFullscreen
        size="small"
        into={into}
      >
        <ModalHeader>
          <AppIcon fetchIcon={this.fetchIcon} className="u-mah-3 u-ml-1" />

          {accounts.length === 0 && <SelectBox />}
          {accounts.length > 0 && (
            <SelectBox
              options={accounts}
              onChange={option => {
                this.fetchAccount(option.trigger)
              }}
              getOptionLabel={option => option.account.auth.login}
              getOptionValue={option => option.trigger._id}
              defaultValue={accounts[0]}
            />
          )}
        </ModalHeader>
        {fetching ? (
          <ModalContent>
            <Spinner
              size="xxlarge"
              className="u-flex u-flex-justify-center u-pv-3"
            />
          </ModalContent>
        ) : (
          <ModalContent className="u-pb-0">
            <SubTitle className="u-mb-1 u-ta-center">
              {t('modal.konnector.title', { name: konnector.name })}
            </SubTitle>
            {error ? (
              <Infos
                actionButton={
                  <Button theme="danger">
                    {t('modal.konnector.error.button')}
                  </Button>
                }
                title={t('modal.konnector.error.title')}
                text={t('modal.konnector.error.description', error)}
                isImportant
              />
            ) : (
              <div className="u-mb-2">
                {!isJobRunning && konnectorJobError && (
                  <TriggerErrorInfo
                    className="u-mb-1"
                    error={konnectorJobError}
                    konnector={konnector}
                  />
                )}
                <LaunchTriggerCard
                  className="u-mb-1"
                  trigger={trigger}
                  onError={this.handleKonnectorJobError}
                  onLaunch={this.handleTriggerLaunch}
                  onSuccess={this.handleKonnectorJobSuccess}
                  submitting={isJobRunning}
                />
                <TriggerManager
                  account={account}
                  konnector={konnector}
                  trigger={trigger}
                  onError={this.handleKonnectorJobError}
                  onLaunch={this.handleTriggerLaunch}
                  onSuccess={this.handleKonnectorJobSuccess}
                  running={isJobRunning}
                  showError={false}
                />
                <DeleteAccountCard
                  account={account}
                  disabled={isJobRunning}
                  onSuccess={dismissAction}
                />
              </div>
            )}
          </ModalContent>
        )}
      </Modal>
    )
  }
}

KonnectorModal.contextTypes = {
  client: PropTypes.object.isRequired
}

export default withMutations(accountMutations, triggersMutations)(
  withLocales(KonnectorModal)
)
