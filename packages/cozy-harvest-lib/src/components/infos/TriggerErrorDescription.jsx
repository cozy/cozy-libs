import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { withClient } from 'cozy-client'

import { getErrorLocale, fetchSupportMail } from '../../helpers/konnectors'
import withKonnectorLocales from '../hoc/withKonnectorLocales'
import Markdown from '../Markdown'

export class TriggerErrorDescription extends PureComponent {
  state = {
    supportMail: null
  }
  async componentDidMount() {
    await this.loadSupportMail()
  }
  async loadSupportMail() {
    const { client } = this.props
    const supportMail = await fetchSupportMail(client)
    this.setState({ supportMail })
  }
  render() {
    const { error, konnector, t } = this.props
    const { supportMail } = this.state

    if (!supportMail) {
      return null
    }

    return (
      <Typography variant="body1" component="div">
        <Markdown
          source={getErrorLocale(
            error,
            konnector,
            t,
            'description',
            supportMail
          )}
        />
      </Typography>
    )
  }
}

TriggerErrorDescription.propTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(
  withClient(withKonnectorLocales(TriggerErrorDescription))
)
