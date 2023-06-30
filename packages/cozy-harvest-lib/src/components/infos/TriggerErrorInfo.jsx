import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Infos from 'cozy-ui/transpiled/react/deprecated/Infos'

import TriggerErrorDescription from './TriggerErrorDescription'
import { getErrorLocale } from '../../helpers/konnectors'
import withKonnectorLocales from '../hoc/withKonnectorLocales'

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
    const { className, error, konnector, t, action } = this.props
    return (
      <Infos
        className={className}
        theme="danger"
        action={action}
        description={
          <>
            <Typography className="u-error" variant="h6" gutterBottom>
              {getErrorLocale(error, konnector, t, 'title')}
            </Typography>
            <TriggerErrorDescription error={error} konnector={konnector} />
          </>
        }
      />
    )
  }
}

TriggerErrorInfo.propTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(withClient(withKonnectorLocales(TriggerErrorInfo)))
