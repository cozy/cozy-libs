import flow from 'lodash/flow'
import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { triggers as triggersModel } from 'cozy-client/dist/models/trigger'
import Button from 'cozy-ui/transpiled/react/Buttons'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Infos from 'cozy-ui/transpiled/react/deprecated/Infos'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import AccountModalHeader from './AccountModalWithoutTabs/AccountModalHeader'
import KonnectorAccountWrapper from './KonnectorConfiguration/KonnectorAccountWrapper'
import { withMountPointProps } from './MountPointContext'
import withLocales from './hoc/withLocales'
import { fetchAccount } from '../connections/accounts'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../helpers/proptypes'

/**
 * Takes an accountId and a list of accounts containing their respecting triggers
 * isplays the selected account and the accounts linked
 * to this konnector
 *
 * You have to pass an array of accounts containing their associated trigger:
 * ```
 * accounts: [
 *  {
 *    account: {
 *       _id: '',
 *    },
 *    trigger: {
 *      id: '',
 *      current_state: {
 *      }
 *    }
 *  }
 * ]
 * ```
 *
 * from this array and from the passed accountId, we can fetch the account.
 *
 */
export class AccountModal extends Component {
  state = {
    trigger: null,
    account: null,
    fetching: true,
    error: null
  }

  async componentDidMount() {
    await this.loadSelectedAccountId()
  }

  async componentDidUpdate(prevProps) {
    if (this.props.accountId !== prevProps.accountId) {
      return await this.loadSelectedAccountId()
    }
  }

  async loadSelectedAccountId() {
    const { accountId, accountsAndTriggers } = this.props
    const matchingTrigger = get(
      accountsAndTriggers.find(
        accountAndTrigger => accountAndTrigger.account._id === accountId
      ),
      'trigger'
    )
    if (matchingTrigger) {
      await this.fetchAccount(matchingTrigger)
    } else {
      this.setState({
        error: new Error('No matching trigger found'),
        fetching: false
      })
    }
  }

  async fetchAccount(trigger) {
    this.setState({ fetching: true })

    try {
      const { client } = this.props
      const account = await fetchAccount(
        client,
        triggersModel.getAccountId(trigger)
      )
      this.setState({
        account,
        trigger
      })
      return account
    } catch (error) {
      this.setState({
        error
      })
    } finally {
      this.setState({
        fetching: false
      })
    }
  }

  render() {
    const {
      konnector,
      onDismiss,
      accountsAndTriggers,
      t,
      replaceHistory,
      initialActiveTab,
      breakpoints: { isMobile },
      showAccountSelection,
      showNewAccountButton,
      intentsApi,
      innerAccountModalOverrides,
      Component
    } = this.props
    const { trigger, account, fetching, error } = this.state

    return (
      <>
        <AccountModalHeader
          konnector={konnector}
          account={account}
          accountsAndTriggers={accountsAndTriggers}
          showAccountSelection={showAccountSelection}
        />
        {(error || fetching) && (
          <DialogContent className="u-pb-2">
            {error && (
              <Infos
                actionButton={
                  <Button
                    color="error"
                    onClick={onDismiss}
                    label={t('modal.konnector.error.button')}
                  />
                }
                title={t('modal.konnector.error.title')}
                text={t('modal.konnector.error.description', error)}
                icon="warning"
                isImportant
              />
            )}
            {fetching && (
              <div className="u-ta-center">
                <Spinner size="xxlarge" />
              </div>
            )}
          </DialogContent>
        )}
        {!error && !fetching && (
          <DialogContent
            className={isMobile ? 'u-pt-0 u-pr-0 u-pl-0' : 'u-pt-0'}
            style={{
              paddingBottom: 'var(--flagship-bottom-height)'
            }}
          >
            <KonnectorAccountWrapper
              initialActiveTab={initialActiveTab}
              konnector={konnector}
              initialTrigger={trigger}
              account={account}
              onAccountDeleted={onDismiss}
              addAccount={() => replaceHistory('/new')}
              showNewAccountButton={showNewAccountButton}
              intentsApi={intentsApi}
              innerAccountModalOverrides={innerAccountModalOverrides}
              Component={Component}
            />
          </DialogContent>
        )}
      </>
    )
  }
}

AccountModal.defaultProps = {
  accounts: [],
  showAccountSelection: true,
  showNewAccountButton: true
}

AccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  onDismiss: PropTypes.func.isRequired,
  /**
   * Contains accounts along with their associated triggers
   * @typedef TriggerAccountItem
   * @property {io.cozy.accounts} account
   * @property {io.cozy.triggers} trigger
   *
   * @type {Array<TriggerAccountItem>}
   */
  accountsAndTriggers: PropTypes.arrayOf(
    PropTypes.shape({
      account: PropTypes.object.isRequired,
      trigger: PropTypes.object.isRequired
    })
  ).isRequired,
  t: PropTypes.func.isRequired,
  replaceHistory: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired,

  /** @type {string} Can be set to force the initial active tab */
  initialActiveTab: PropTypes.oneOf(['configuration', 'data']),

  /** @type {Boolean} Whether to show the account selection UI */
  showAccountSelection: PropTypes.bool,

  /** @type {Boolean} Whether to show the button to add a new account */
  showNewAccountButton: PropTypes.bool,

  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype,

  Component: PropTypes.func
}

export default flow(
  withClient,
  withLocales,
  withMountPointProps,
  withBreakpoints()
)(AccountModal)
