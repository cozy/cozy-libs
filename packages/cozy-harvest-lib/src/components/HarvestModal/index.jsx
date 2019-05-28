import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Modal, { ModalDescription, ModalHeader } from 'cozy-ui/react/Modal'
import AppIcon from 'cozy-ui/react/AppIcon'
import Spinner from 'cozy-ui/react/Spinner'

import HarvestModalContent from './Content'
import withAccountFromTrigger from '../HOCs/withAccountFromTrigger'

export class HarvestModal extends PureComponent {
  constructor(props) {
    super(props)
    this.fetchIcon = this.fetchIcon.bind(this)
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
      account,
      dismissAction,
      fetchingAccount,
      konnector,
      into,
      trigger,
      onLoginSuccess,
      onSuccess,
      running
    } = this.props

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
        <ModalDescription>
          {fetchingAccount ? (
            <Spinner
              size="xxlarge"
              className="u-flex u-flex-justify-center u-pv-3"
            />
          ) : (
            <HarvestModalContent
              account={account}
              konnector={konnector}
              showError={false}
              trigger={trigger}
              running={running}
              onLoginSuccess={onLoginSuccess}
              onSuccess={onSuccess}
            />
          )}
        </ModalDescription>
      </Modal>
    )
  }
}

HarvestModal.contextTypes = {
  client: PropTypes.object.isRequired
}

export default withAccountFromTrigger(HarvestModal)
