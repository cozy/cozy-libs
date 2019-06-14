import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { SubTitle, Text } from 'cozy-ui/transpiled/react/Text'

import DeleteAccountButton from '../DeleteAccountButton'

export class DeleteAccountCard extends PureComponent {
  render() {
    const { account, onSuccess, t } = this.props
    return (
      <Card>
        <SubTitle className="u-mb-1">{t('card.deleteAccount.title')}</SubTitle>
        <Text className="u-mb-1">{t('card.deleteAccount.description')}</Text>
        <DeleteAccountButton
          account={account}
          onSuccess={onSuccess}
          extension="full"
        />
      </Card>
    )
  }
}

DeleteAccountCard.propTypes = {
  ...DeleteAccountButton.propTypes,
  t: PropTypes.func.isRequired
}

export default translate()(DeleteAccountCard)
