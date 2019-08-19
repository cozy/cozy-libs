import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Infos from 'cozy-ui/transpiled/react/Infos'

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
    /* eslint-disable-next-line no-console */
    console.error(error)
    return (
      <Infos
        className={className}
        isImportant
        text={
          <Markdown
            source={getErrorLocale(error, konnector, t, 'description')}
          />
        }
        title={getErrorLocale(error, konnector, t, 'title')}
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
