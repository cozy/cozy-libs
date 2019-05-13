import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import Infos from 'cozy-ui/react/Infos'

import { KonnectorJobError } from '../../helpers/konnectors'
import Markdown from '../Markdown'

/**
 * Return the locale key corresponding to error for a given error code
 * @param  {string} code Error code as returned by a konnector job
 * @return {string}      locale key
 */
const getKonnectorJobKey = code => `error.job.${code}`

/**
 * Component used to show an error related to an account or to a konnector job
 * Regular error are treated in a common way, but for KonnectorJobErrors
 * we can add a little bit of logic.
 *
 * This component is strongly related with the content of locales files and
 * deals mainly with translation concerns.
 */
export class AccountFormError extends PureComponent {
  defaultKey = 'error.job.UNKNOWN_ERROR'

  /**
   * Returns the locale of an error key (description or title or else).
   * This method first try to get the full error code
   * (for example LOGIN_FAILED.LOGIN_FAILED.NEEDS_SECRET), then fallback on the
   * error type, which is the error code first segment (in our example, it's
   * LOGIN_FAILED). It none of these two tries returns anything, it means
   * that the error is unknown or not yet handled by harvest, so we fallback
   * to the default error messages.
   * @param  {Error} error      The error
   * @param  {Object} konnector konnector related to this error
   * @param  {Func} t           Translation function, expected to be Polyglot.t()
   * @return {String}           The error locale
   */
  getErrorLocale(suffixKey) {
    const { error, konnector, t } = this.props

    const args = {
      name: konnector.name || '',
      link: konnector.vendor_link || ''
    }

    // not handled errors
    if (!(error instanceof KonnectorJobError)) {
      const locale = t(`${this.defaultKey}.${suffixKey}`, args)
      // since it's not handled errors, we add more details if available
      if (suffixKey === 'description') {
        return error.message ? `${locale} (${error.message})` : locale
      }
      return t(`${this.defaultKey}.${suffixKey}`, args)
    }

    return t(`${getKonnectorJobKey(error.code)}.${suffixKey}`, {
      ...args,
      _: t(`${getKonnectorJobKey(error.type)}.${suffixKey}`, {
        ...args,
        _: t(`${this.defaultKey}.${suffixKey}`, args)
      })
    })
  }

  render() {
    const { error } = this.props
    /* eslint-disable-next-line no-console */
    console.error(error)
    return (
      <Infos
        title={this.getErrorLocale('title')}
        text={<Markdown source={this.getErrorLocale('description')} />}
        isImportant
      />
    )
  }
}

AccountFormError.proptTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(AccountFormError)
