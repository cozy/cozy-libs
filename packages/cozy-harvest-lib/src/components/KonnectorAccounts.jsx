import React from 'react'
import PropTypes from 'prop-types'
import { withClient, withMutations } from 'cozy-client'
import { withRouter } from 'react-router'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Button from 'cozy-ui/transpiled/react/Button'
import get from 'lodash/get'
import compose from 'lodash/flowRight'
import keyBy from 'lodash/keyBy'
import CozyRealtime from 'cozy-realtime'

import { findAccount } from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import KonnectorModalHeader from './KonnectorModalHeader'

/**
 * Returns { trigger, account } list
 */
const fetchAccountsFromTriggers = async (client, triggers) => {
  const accountCol = client.collection('io.cozy.accounts')
  const accountIdToTrigger = keyBy(triggers, triggersModel.getAccountId)
  const accountIds = Object.keys(accountIdToTrigger)
  const { data: accounts } = await accountCol.getAll(accountIds)
  return accounts
    .filter(Boolean)
    .map(account => ({ account, trigger: accountIdToTrigger[account._id] }))
}

export class KonnectorAccounts extends React.Component {
  constructor(props) {
    super(props)
    this.realtime = new CozyRealtime({ client: this.props.client })
    this.state = {
      fetchingAccounts: true,
      error: null,
      accounts: []
    }
  }

  /**
   * At the moment we fetch the accounts manually and the triggers are received as props
   * TODO Use queryConnect to fetch the accounts and the triggers once the home uses queryConnect too
   * (Using queryConnect here before the home would result in duplicate queries and longer loading times than necessary)
   */
  async componentDidMount() {
    await this.fetchAccounts()

    await this.realtime.subscribe(
      'updated',
      'io.cozy.jobs',
      this.handleTriggerUpdate.bind(this)
    )
  }

  componentDidUpdate(prevProps) {
    // After leaving the new account screen, we need to refetch accounts in case a new one was created
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      /\/new\/?$/.test(prevProps.location.pathname)
    ) {
      this.fetchAccounts()
    }
  }

  async handleTriggerUpdate(job) {
    const { fetchTrigger } = this.props
    const { accounts } = this.state
    const triggerId = job.trigger_id

    const matchingAccount = accounts.find(
      ({ trigger }) => trigger && trigger._id === triggerId
    )

    if (matchingAccount) {
      const trigger = await fetchTrigger(triggerId)
      const updatedAccountIndex = accounts.indexOf(matchingAccount)

      this.setState({
        accounts: [
          ...accounts.slice(0, updatedAccountIndex),
          {
            account: matchingAccount.account,
            trigger
          },
          ...accounts.slice(updatedAccountIndex + 1)
        ]
      })
    }
  }

  async fetchAccounts() {
    const triggers = get(this.props, 'konnector.triggers.data', [])
    const { client } = this.props
    this.setState({ fetchingAccounts: true })
    try {
      const triggerAccounts = await fetchAccountsFromTriggers(client, triggers)
      this.setState({ accounts: triggerAccounts, error: null })
    } catch (error) {
      console.error(error)
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
  client: PropTypes.object.isRequired,
  fetchTrigger: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default compose(
  withMutations(triggersMutations),
  withRouter,
  translate(),
  withClient
)(KonnectorAccounts)
