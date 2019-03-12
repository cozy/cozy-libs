import React, { PureComponent } from 'react'
import PropTypes from 'react-proptypes'

import { translate } from 'cozy-ui/react/I18n'

import { KonnectorJobError } from 'helpers/konnectors'
import Markdown from 'components/Markdown'

/**
 * Return the locale key corresponding to error description for a given error
 * code.
 * @param  {string} code Error code as returned by a konnector job
 * @return {string}      locale key
 */
const getKonnectorJobKey = code => `error.job.${code}.description`

/**
 * Component used to show an error related to an account or to a konnector job
 * Regular error are treated in a common way, but for KonnectorJobErrors
 * we can add a little bit of logic.
 *
 * This component is strongly related with the content of locales files and
 * deals mainly with translation concerns.
 */
export class AccountFormError extends PureComponent {
  defaultKey = 'error.job.UNKNOWN_ERROR.description'

  /**
   * Returns the description of an error.
   * This method first try to get the full error code
   * (for example LOGIN_FAILED.LOGIN_FAILED.NEEDS_SECRET), then fallback on the
   * error type, which is the error code first segment (in our example, it's
   * LOGIN_FAILED). It none of these two tries returns anything, it means
   * that the error is unknown or not yet handled by harvest, so we fallback
   * to the default error messages.
   * @param  {Error} error      The error
   * @param  {Object} konnector konnector related to this error
   * @param  {Func} t           Translation function, expected to be Polyglot.t()
   * @return {String}           The error description
   */
  getDescription() {
    const { error, konnector, t } = this.props

    const args = {
      name: konnector.name || '',
      link: konnector.vendor_link || ''
    }

    if (error instanceof KonnectorJobError) {
      return t(getKonnectorJobKey(error.code), {
        ...args,
        _: t(getKonnectorJobKey(error.type), {
          ...args,
          _: t(this.defaultKey, args)
        })
      })
    }

    const description = t(this.defaultKey, args)
    return error.message ? `${description} (${error.message})` : description
  }

  render() {
    const { error } = this.props
    /* eslint-disable-next-line no-console */
    console.error(error)
    const errorDescription = this.getDescription()
    return (
      <div className="u-error">
        <Markdown source={errorDescription} />
      </div>
    )
  }
}

AccountFormError.proptTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(AccountFormError)
