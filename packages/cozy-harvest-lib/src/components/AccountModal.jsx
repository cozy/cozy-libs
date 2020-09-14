import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get from 'lodash/get'
import flow from 'lodash/flow'
import { withClient } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import { fetchAccount } from '../connections/accounts'
import * as triggersModel from '../helpers/triggers'
import KonnectorAccountTabs from './KonnectorConfiguration/KonnectorAccountTabs'
import AccountSelectBox from './AccountSelectBox/AccountSelectBox'
import KonnectorModalHeader from './KonnectorModalHeader'
import { withMountPointPushHistory } from './MountPointContext'
import withLocales from './hoc/withLocales'

/**
 * AccountModal take an accountId and a list of accounts containing their
 * respecting triggers and display the selected account and the accounts linked
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
      pushHistory,
      initialActiveTab,
      breakpoints: { isMobile },
      showAccountSelection,
      showNewAccountButton
    } = this.props
    const { trigger, account, fetching, error } = this.state
    return (
      <>
        <KonnectorModalHeader konnector={konnector}>
          {showAccountSelection ? (
            <AccountSelectBox
              loading={!account}
              selectedAccount={account}
              accountsAndTriggers={accountsAndTriggers}
              onChange={option => {
                pushHistory(`/accounts/${option.account._id}`)
              }}
              onCreate={() => {
                pushHistory('/new')
              }}
            />
          ) : null}
        </KonnectorModalHeader>
        <ModalContent>
          {error && (
            <Infos
              actionButton={
                <Button
                  theme="danger"
                  onClick={this.loadSelectedAccountId.bind(this)}
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
        </ModalContent>
        {!error && !fetching && (
          <ModalContent className={isMobile ? 'u-p-0' : null}>
            <KonnectorAccountTabs
              initialActiveTab={initialActiveTab}
              konnector={konnector}
              trigger={trigger}
              account={account}
              onAccountDeleted={onDismiss}
              addAccount={() => pushHistory('/new')}
              showNewAccountButton={showNewAccountButton}
            />
          </ModalContent>
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
  pushHistory: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired,

  /** @type {string} Can be set to force the initial active tab */
  initialActiveTab: PropTypes.oneOf(['configuration', 'data']),

  /** @type {Boolean} Whether to show the account selection UI */
  showAccountSelection: PropTypes.bool,

  /** @type {Boolean} Whether to show the button to add a new account */
  showNewAccountButton: PropTypes.bool
}

export default flow(
  withClient,
  withLocales,
  translate(),
  withMountPointPushHistory,
  withBreakpoints()
)(AccountModal)
