import React from 'react'
import PropTypes from 'prop-types'

import { Account } from 'cozy-doctypes'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Card from 'cozy-ui/transpiled/react/Card'
import { Caption } from 'cozy-ui/transpiled/react/Text'
import { getErrorLocale } from '../../helpers/konnectors'

import withLocales from '../hoc/withLocales'
import * as triggersModel from '../../helpers/triggers'

export class AccountListItem extends React.PureComponent {
  getStatusContent = () => {
    const { t, trigger, konnector } = this.props
    const error = triggersModel.getError(trigger)
    const errorTitle = getErrorLocale(error, konnector, t, 'title')

    if (error) {
      return (
        <div className="u-pomegranate u-flex u-flex-justify-center u-flex-items-center">
          <span className="u-mr-half u-caption u-pomegranate">
            {errorTitle}
          </span>
          <Icon icon="warning" />
        </div>
      )
    } else {
      return <Icon icon="check-circleless" color="#2BBA40" />
    }
  }

  render() {
    const { account, onClick } = this.props

    const accountName = Account.getAccountName(account)
    const accountLogin = Account.getAccountLogin(account)
    const nameAndLoginDiffer = accountName !== accountLogin
    const statusContent = this.getStatusContent()
    return (
      <Card className="u-flex u-flex-justify-between" onClick={onClick}>
        <div>
          <div>{accountName}</div>
          {nameAndLoginDiffer && <Caption>{accountLogin}</Caption>}
        </div>
        <div>{statusContent}</div>
      </Card>
    )
  }
}

AccountListItem.propTypes = {
  account: PropTypes.object.isRequired,
  konnector: PropTypes.shape({
    name: PropTypes.string,
    vendor_link: PropTypes.string
  }).isRequired,
  trigger: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default withLocales(AccountListItem)
