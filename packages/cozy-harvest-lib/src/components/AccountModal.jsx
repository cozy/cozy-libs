import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get from 'lodash/get'
import flow from 'lodash/flow'
import { withMutations } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import KonnectorAccountTabs from './KonnectorConfiguration/KonnectorAccountTabs'
import AccountSelectBox from './AccountSelectBox/AccountSelectBox'
import KonnectorModalHeader from './KonnectorModalHeader'
import { withMountPointPushHistory } from './MountPointContext'

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
    const { accountId, accounts } = this.props
    const matchingTrigger = get(
      accounts.find(account => account.account._id === accountId),
      'trigger'
    )
    if (matchingTrigger) await this.fetchAccount(matchingTrigger)
    else
      this.setState({
        error: new Error('No matching trigger found'),
        fetching: false
      })
  }

  async fetchAccount(trigger) {
    const { findAccount } = this.props
    this.setState({ fetching: true })

    try {
      const account = await findAccount(triggersModel.getAccountId(trigger))
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
    const { konnector, onDismiss, accounts, t, pushHistory } = this.props
    const { trigger, account, fetching, error } = this.state
    return (
      <>
        <KonnectorModalHeader konnector={konnector}>
          {account && (
            <AccountSelectBox
              selectedAccount={account}
              accountsList={accounts}
              onChange={option => {
                pushHistory(`/accounts/${option.account._id}`)
              }}
              onCreate={() => {
                pushHistory('/new')
              }}
            />
          )}
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
          {!error && !fetching && (
            <KonnectorAccountTabs
              konnector={konnector}
              trigger={trigger}
              account={account}
              onAccountDeleted={onDismiss}
              addAccount={() => pushHistory('/new')}
            />
          )}
        </ModalContent>
      </>
    )
  }
}
AccountModal.defaultProps = {
  accounts: []
}
AccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  onDismiss: PropTypes.func,
  accounts: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  findAccount: PropTypes.func.isRequired,
  pushHistory: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired
}

export default flow(
  withMutations(accountMutations, triggersMutations),
  translate(),
  withMountPointPushHistory
)(AccountModal)
