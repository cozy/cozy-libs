import React from 'react'
import PropTypes from 'prop-types'
import Topbar from './Topbar'
import { translate } from 'cozy-ui/transpiled/react/I18n'

class Amount extends React.Component {
  render () {
    const { t } = this.props
    return (
      <div>
        <Topbar title={t('sections.amount.title')} />
        Amount
      </div>
    )
  }
}

export default translate()(Amount)
