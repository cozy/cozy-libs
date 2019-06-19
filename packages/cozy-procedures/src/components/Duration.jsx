import React from 'react'
import PropTypes from 'prop-types'
import Topbar from './Topbar'
import { translate } from 'cozy-ui/transpiled/react/I18n'

class Duration extends React.Component {
  render() {
    const { t } = this.props
    return (
      <div>
        <Topbar title={t('duration.title')} />
        Duration
      </div>
    )
  }
}

Duration.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate()(Duration)
