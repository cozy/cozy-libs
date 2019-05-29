import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'
import AppIcon from 'cozy-ui/react/AppIcon'
import Button from 'cozy-ui/react/Button'
import Infos from 'cozy-ui/react/Infos'
import Modal, { ModalContent, ModalHeader } from 'cozy-ui/react/Modal'
import Spinner from 'cozy-ui/react/Spinner'
import { SubTitle } from 'cozy-ui/react/Text'

import accountMutations from '../connections/accounts'
import * as triggers from '../helpers/triggers'
import TriggerManager from './TriggerManager'
import DeleteAccountButton from './DeleteAccountButton'
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
      this.setState({ account })
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

  render() {
    const {
      dismissAction,
      konnector,
      into,
      onLoginSuccess,
      onSuccess,
      running,
      t
    } = this.props

    const { account, error, fetching, trigger } = this.state

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
          <ModalContent>
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
              <div>
                <TriggerManager
                  account={account}
                  konnector={konnector}
                  trigger={trigger}
                  running={running}
                  onLoginSuccess={onLoginSuccess}
                  onSuccess={onSuccess}
                />
                <DeleteAccountButton
                  account={account}
                  onSuccess={dismissAction}
                  extension="full"
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

export default withMutations(accountMutations)(withLocales(KonnectorModal))
