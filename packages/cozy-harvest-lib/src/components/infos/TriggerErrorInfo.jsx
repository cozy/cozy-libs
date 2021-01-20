import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Typography from 'cozy-ui/transpiled/react/Typography'

import { getErrorLocale } from '../../helpers/konnectors'
import withKonnectorLocales from '../hoc/withKonnectorLocales'
import Markdown from '../Markdown'

/**
 * Component used to show an error related to an account or to a konnector job
 * Regular error are treated in a common way, but for KonnectorJobErrors
 * we can add a little bit of logic.
 *
 * This component is strongly related with the content of locales files and
 * deals mainly with translation concerns.
 */
export class TriggerErrorInfo extends PureComponent {
  render() {
    const { className, error, konnector, t } = this.props
    return (
      <Infos
        className={className}
        theme="danger"
        description={
          <>
            <Typography className="u-error" variant="h6" gutterBottom>
              {getErrorLocale(error, konnector, t, 'title')}
            </Typography>
            <Typography variant="body1" component="div">
              <Markdown
                source={getErrorLocale(error, konnector, t, 'description')}
              />
            </Typography>
          </>
        }
      />
    )
  }
}

TriggerErrorInfo.proptTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(withKonnectorLocales(TriggerErrorInfo))
