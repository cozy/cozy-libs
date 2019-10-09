import React from 'react'
import PropTypes from 'prop-types'
import { withMutations } from 'cozy-client'
import { withRouter } from 'react-router'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Button from 'cozy-ui/transpiled/react/Button'
import get from 'lodash/get'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import KonnectorModalHeader from './KonnectorModalHeader'

class KonnectorAccounts extends React.Component {
  state = {
    fetchingAccounts: true,
    error: null,
    accounts: []
  }

  /**
   * TODO Use queryConnect to fetch the accounts
   */
  async componentDidMount() {
    await this.fetchAccounts()
  }

  componentDidUpdate(prevProps) {
    // After leaving the new account screen, we need to refetch accounts in case a new one was created
    // TODO: We should use an AccountsWatcher (realtime)
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      /\/new\/?$/.test(prevProps.location.pathname)
    ) {
      this.fetchAccounts()
    }
  }

  async fetchAccounts() {
    const triggers = get(this.props, 'konnector.triggers.data', [])
    const { findAccount } = this.props
    this.setState({ fetchingAccounts: true })
    try {
      const accounts = (await Promise.all(
        triggers.map(async trigger => {
          return {
            account: await findAccount(triggersModel.getAccountId(trigger)),
            trigger
          }
        })
      )).filter(({ account }) => !!account)
      this.setState({ accounts, error: null })
    } catch (error) {
      this.setState({ error })
    } finally {
      this.setState({ fetchingAccounts: false })
    }
  }

  render() {
    const { accounts, fetchingAccounts, error } = this.state
    const { konnector, t } = this.props
    return (
      <>
        {(error || fetchingAccounts) && (
          <KonnectorModalHeader konnector={konnector} />
        )}
        {error && (
          <ModalContent>
            <Infos
              actionButton={
                <Button
                  theme="danger"
                  onClick={this.fetchAccounts.bind(this)}
                  label={t('modal.accounts.error.retry')}
                />
              }
              title={t('modal.accounts.error.title')}
              text={t('modal.accounts.error.description')}
              icon="warning"
              isImportant
            />
          </ModalContent>
        )}
        {fetchingAccounts && (
          <ModalContent>
            <div className="u-pv-2 u-ta-center">
              <Spinner size="xxlarge" />
            </div>
          </ModalContent>
        )}
        {!error && !fetchingAccounts && this.props.children(accounts)}
      </>
    )
  }
}

KonnectorAccounts.propTypes = {
  konnector: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  findAccount: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}
export default withMutations(accountMutations, triggersMutations)(
  withRouter(translate()(KonnectorAccounts))
)
