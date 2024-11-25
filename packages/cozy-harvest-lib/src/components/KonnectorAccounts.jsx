import compose from 'lodash/flowRight'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React from 'react'
import { useLocation } from 'react-router-dom'

import { withClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Infos from 'cozy-ui/transpiled/react/deprecated/Infos'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import KonnectorModalHeader from './KonnectorModalHeader'
import { fetchAccountsFromTriggers } from '../connections/accounts'
import { fetchTrigger } from '../connections/triggers'
import logger from '../logger'

export class KonnectorAccounts extends React.Component {
  constructor(props) {
    super(props)
    this.handleJobUpdate = this.handleJobUpdate.bind(this)
    this.state = {
      fetchingAccounts: true,
      error: null,
      boundaryError: null,
      boundaryErrorInfo: null,
      accounts: []
    }
  }

  componentDidCatch(boundaryError, boundaryErrorInfo) {
    this.setState({ boundaryError, boundaryErrorInfo })
  }

  /**
   * At the moment we fetch the accounts manually and the triggers are received as props
   * TODO Use queryConnect to fetch the accounts and the triggers once the home uses queryConnect too
   * (Using queryConnect here before the home would result in duplicate queries and longer loading times than necessary)
   */
  async componentDidMount() {
    await this.fetchAccounts()
    const realtime = this.props.client.plugins.realtime
    realtime.subscribe('updated', 'io.cozy.jobs', this.handleJobUpdate)
  }

  componentWillUnmount() {
    const realtime = this.props.client.plugins.realtime
    realtime.unsubscribe('updated', 'io.cozy.jobs', this.handleJobUpdate)
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

  async handleJobUpdate(job) {
    const { client } = this.props
    const { accounts } = this.state
    const triggerId = job.trigger_id

    const matchingAccount = accounts.find(
      ({ trigger }) => trigger && trigger._id === triggerId
    )

    if (matchingAccount) {
      const trigger = await fetchTrigger(client, triggerId)
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
    const triggers =
      this.props.triggers || get(this.props, 'konnector.triggers.data', [])
    const { client } = this.props
    this.setState({ fetchingAccounts: true })
    try {
      const triggerAccounts = await fetchAccountsFromTriggers(client, triggers)
      this.setState({ accounts: triggerAccounts, error: null })
    } catch (error) {
      logger.error('KonnectorAccounts could not fetch accounts', error)
      this.setState({ error })
    } finally {
      this.setState({ fetchingAccounts: false })
    }
  }

  render() {
    const { accounts, fetchingAccounts, error } = this.state
    const { konnector, t } = this.props

    if (this.state.boundaryErrorInfo) {
      return (
        <div className="u-error">
          <Typography variant="h6">
            {this.state.boundaryError.message}
          </Typography>
          <pre>{this.state.boundaryErrorInfo.componentStack + ''}</pre>
        </div>
      )
    }

    return (
      <>
        {(error || fetchingAccounts) && (
          <KonnectorModalHeader konnector={konnector} />
        )}
        {error && (
          <DialogContent className="u-pb-2">
            <Infos
              actionButton={
                <Button
                  color="error"
                  onClick={this.fetchAccounts.bind(this)}
                  label={t('modal.accounts.error.retry')}
                />
              }
              title={t('modal.accounts.error.title')}
              text={t('modal.accounts.error.description')}
              icon="warning"
              isImportant
            />
          </DialogContent>
        )}
        {fetchingAccounts && (
          <DialogContent className="u-pb-2">
            <div className="u-pv-2 u-ta-center">
              <Spinner size="xxlarge" />
            </div>
          </DialogContent>
        )}
        {!error && !fetchingAccounts ? this.props.children(accounts) : null}
      </>
    )
  }
}

KonnectorAccounts.propTypes = {
  konnector: PropTypes.object.isRequired,
  /** @type {io.cozy.triggers} Can be passed if the konnector object does not contain the triggers */
  triggers: PropTypes.array,
  location: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

const KonnectorAccountsWrapper = props => {
  const location = useLocation()

  return <KonnectorAccounts {...props} location={location} />
}

export default compose(translate(), withClient)(KonnectorAccountsWrapper)
