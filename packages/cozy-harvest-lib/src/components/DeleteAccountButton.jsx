import omit from 'lodash/omit'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'

import { i18nContextTypes } from './hoc/withLocales'
import { deleteAccount } from '../connections/accounts'

export class DeleteAccountButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleting: false
    }
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    this._mounted = true
  }

  componentWillUnmount() {
    this._mounted = false
  }

  async handleDelete() {
    const { client } = this.props
    this.setState({ deleting: true })
    const { account, onError, onSuccess } = this.props
    try {
      await deleteAccount(client, account)
      if (typeof onSuccess === 'function') onSuccess(account)
    } catch (e) {
      if (typeof onError === 'function') {
        onError(e)
      } else {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    } finally {
      if (this._mounted) this.setState({ deleting: false })
    }
  }

  render() {
    const { t } = this.props
    const { deleting } = this.state
    return (
      <Button
        theme="danger-outline"
        disabled={deleting}
        busy={deleting}
        onClick={this.handleDelete}
        label={t('accountForm.disconnect.button')}
        {...omit(this.props, Object.keys(excludedButtonProptypes), 'client')}
      />
    )
  }
}

DeleteAccountButton.propTypes = {
  /**
   * io.cozy.accounts document
   */
  account: PropTypes.object.isRequired,
  /**
   * callback to handle account deleting error
   */
  onError: PropTypes.func,
  /**
   * callback to handle account deleting success
   */
  onSuccess: PropTypes.func,
  /**
   * Provided by translate HOC
   */
  t: PropTypes.func.isRequired
}

const excludedButtonProptypes = {
  ...DeleteAccountButton.propTypes,
  ...i18nContextTypes
}

export default translate()(withClient(DeleteAccountButton))
