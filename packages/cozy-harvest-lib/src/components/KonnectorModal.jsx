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
import * as triggers from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import DeleteAccountCard from './cards/DeleteAccountCard'
import LaunchTriggerCard from './cards/LaunchTriggerCard'
import TriggerErrorInfo from './infos/TriggerErrorInfo'
import withLocales from './hoc/withLocales'

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
    trigger: null
  }

  constructor(props) {
    super(props)
    this.fetchIcon = this.fetchIcon.bind(this)
    this.handleKonnectorJobError = this.handleKonnectorJobError.bind(this)
    this.handleKonnectorJobSuccess = this.handleKonnectorJobSuccess.bind(this)
    this.handleTriggerLaunch = this.handleTriggerLaunch.bind(this)
  }

  componentDidMount() {
    this.fetchAccount()
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

  async fetchAccount() {
    const { findAccount } = this.props
    this.setState({ fetching: true })
    const { konnector } = this.props
    const trigger = konnector.triggers.data[0]

    try {
      const account = await findAccount(triggers.getAccountId(trigger))
      this.setState({ account, trigger })
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

  async handleKonnectorJobError() {
    const { fetchTrigger } = this.props
    const { trigger } = this.state
    this.setState({
      isJobRunning: false,
      trigger: await fetchTrigger(trigger._id)
    })
  }

  handleKonnectorJobSuccess(trigger) {
    this.setState({ isJobRunning: false, trigger })
  }

  handleTriggerLaunch() {
    this.setState({ isJobRunning: true })
  }

  render() {
    const { dismissAction, konnector, into, t } = this.props

    const { account, error, fetching, isJobRunning, trigger } = this.state
    const triggerError = triggers.getError(trigger)

    return (
      <Modal
        dismissAction={dismissAction}
        mobileFullscreen
        size="small"
        into={into}
      >
        <ModalHeader>
          <AppIcon fetchIcon={this.fetchIcon} className="u-mah-3 u-ml-1" />
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
                {!isJobRunning && triggerError && (
                  <TriggerErrorInfo
                    className="u-mb-1"
                    error={triggerError}
                    konnector={konnector}
                  />
                )}
                <LaunchTriggerCard
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
