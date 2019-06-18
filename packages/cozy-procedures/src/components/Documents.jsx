import React from 'react'
import PropTypes from 'prop-types'
import Topbar from './Topbar'
import { translate } from 'cozy-ui/transpiled/react/I18n'

class Documents extends React.Component {
  render () {
    const { t } = this.props
    return (
      <div>
        <Topbar title={t('sections.documents.title')} />
        Documents
      </div>
    )
  }
}

export default translate()(Documents)
