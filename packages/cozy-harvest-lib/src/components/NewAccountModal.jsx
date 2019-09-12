import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import cx from 'classnames'

import { ModalContent, ModalHeader } from 'cozy-ui/transpiled/react/Modal'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import TriggerManager from '../components/TriggerManager'
import KonnectorIcon from './KonnectorIcon'
import * as triggersModel from '../helpers/triggers'

/**
 * We need to deal with `onLoginSuccess` and `onSucess` because we
 * can have a `onSuccess` without having a `onLoginSuccess` since only
 * few konnectors know if the login is success or not.
 *
 */
class NewAccountModal extends Component {
  render() {
    const {
      konnector,
      history,
      breakpoints: { isMobile }
    } = this.props
    return (
      <>
        <ModalHeader className="u-pr-2 u-mb-1">
          <KonnectorIcon
            konnector={konnector}
            className="u-db u-w-3 u-h-3 u-ml-auto u-mr-auto"
          />
        </ModalHeader>
        <ModalContent className={cx({ 'u-ph-1': isMobile })}>
          <TriggerManager
            konnector={konnector}
            onLoginSuccess={trigger => {
              const accountId = triggersModel.getAccountId(trigger)
              history.push(`../accounts/${accountId}`)
            }}
            onSuccess={trigger => {
              const accountId = triggersModel.getAccountId(trigger)
              history.push(`../accounts/${accountId}`)
            }}
          />
        </ModalContent>
      </>
    )
  }
}

NewAccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withBreakpoints()(withRouter(NewAccountModal))
