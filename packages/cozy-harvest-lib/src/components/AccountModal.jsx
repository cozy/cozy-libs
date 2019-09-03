import React, { Component } from 'react'
import PropTypes from 'prop-types'

import get from 'lodash/get'
import { withMutations } from 'cozy-client'
import { withRouter } from 'react-router'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Button from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import KonnectorConfiguration from './KonnectorConfiguration/KonnectorConfiguration'
import AccountSelectBox from './AccountSelectBox/AccountSelectBox'
import KonnectorModalHeader from './KonnectorModalHeader'

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
class AccountModal extends Component {
  state = {
    trigger: null,
    account: null,
    fetching: true,
    error: false
  }
  componentDidMount() {
    this.loadSelectedAccountId()
  }

  componentDidUpdate(prevProps) {
    if (this.props.accountId !== prevProps.accountId)
      this.loadSelectedAccountId()
  }

  loadSelectedAccountId() {
    const { accountId, accounts } = this.props
    const matchingTrigger = get(
      accounts.find(account => account.account._id === accountId),
      'trigger'
    )
    if (matchingTrigger) this.fetchAccount(matchingTrigger)
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
    const { konnector, onDismiss, history, accounts, t } = this.props
    const { trigger, account, fetching, error } = this.state
    return (
      <>
        <KonnectorModalHeader konnector={konnector}>
          {account && (
            <AccountSelectBox
              selectedAccount={account}
              accountsList={accounts}
              onChange={option => {
                history.push(`../${option.account._id}`)
              }}
              onCreate={() => {
                history.push(`../../new`)
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
            <KonnectorConfiguration
              konnector={konnector}
              trigger={trigger}
              account={account}
              onAccountDeleted={onDismiss}
              addAccount={() => history.push('../new')}
            />
          )}
        </ModalContent>
      </>
    )
  }
}

AccountModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  onDismiss: PropTypes.func,
  history: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
  findAccount: PropTypes.func.isRequired,
  accountId: PropTypes.string.isRequired
}
export default withMutations(accountMutations, triggersMutations)(
  withRouter(translate()(AccountModal))
)
