import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'

import { Button } from 'cozy-ui/transpiled/react/Button'
import { withMutations } from 'cozy-client'

import accountsMutations from '../connections/accounts'
import withLocales from './hoc/withLocales'

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
    this.setState({ deleting: true })
    const { account, deleteAccount, onError, onSuccess } = this.props
    try {
      await deleteAccount(account)
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
        {...omit(this.props, Object.keys(DeleteAccountButton.propTypes))}
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
   * Provided by accountsMutations
   */
  deleteAccount: PropTypes.func.isRequired,
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

export default withLocales(
  withMutations(accountsMutations)(DeleteAccountButton)
)
