import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import Button from 'cozy-ui/transpiled/react/Button'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Icon from 'cozy-ui/transpiled/react/Icon'
import get from 'lodash/get'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'

import withLocales from './hoc/withLocales'

import TriggerManager from './TriggerManager'
import AccountSelectBox from './AccountSelectBox/AccountSelectBox'
import AccountsList from './AccountsList/AccountsList'
import KonnectorConfiguration from './KonnectorConfiguration/KonnectorConfiguration'

/**
 * KonnectorModal open a Modal related to a given konnector. It fetches the
 * first account and then include a TriggerManager component.
 *
 * This component is aimed to offer an UI to manage all the konnector related
 * triggers and accounts.
 */
export class KonnectorModal extends PureComponent {
  state = {
    account: null,
    fetching: false,
    fetchingAccounts: false,
    addingAccount: false,
    trigger: null,
    accounts: []
  }

  constructor(props) {
    super(props)
    this.fetchIcon = this.fetchIcon.bind(this)
    this.requestAccountChange = this.requestAccountChange.bind(this)
    this.requestAccountCreation = this.requestAccountCreation.bind(this)
    this.endAccountCreation = this.endAccountCreation.bind(this)
  }
  /**
   * TODO We should not fetchAccounts and fetchAccount since we already have the informations
   * in the props. We kept this sytem for compatibility on the existing override.
   * Next tasks: remove these methods and rewrite the override
   */
  async componentDidMount() {
    await this.fetchAccounts()
    const { accounts } = this.state

    if (this.props.accountId) this.loadSelectedAccountId()
    else if (accounts.length === 1)
      this.requestAccountChange(accounts[0].account, accounts[0].trigger)
  }

  componentWillUnmount() {
    const { into } = this.props
    if (!into || into === 'body') return
    // The Modal is never closed after a dismiss on Preact apps, even if it is
    // not rendered anymore. The best hack we found is to explicitly empty the
    // modal portal container.
    setTimeout(() => {
      try {
        const modalRoot = document.querySelector(into)
        modalRoot.innerHTML = ''
        // eslint-disable-next-line no-empty
      } catch (error) {}
    }, 50)
  }

  componentDidUpdate(prevProps) {
    if (this.props.accountId && this.props.accountId !== prevProps.accountId) {
      this.loadSelectedAccountId()
    }
  }

  requestAccountChange(account, trigger) {
    // This component can either defer the account switching to a parent component through the onAccountChange prop, or handle the change itself if the prop is missing
    const { onAccountChange } = this.props
    return onAccountChange
      ? onAccountChange(account)
      : this.fetchAccount(trigger)
  }

  loadSelectedAccountId() {
    const selectedAccountId = this.props.accountId
    const { accounts } = this.state

    const matchingTrigger = get(
      accounts.find(account => account.account._id === selectedAccountId),
      'trigger'
    )

    if (matchingTrigger) this.fetchAccount(matchingTrigger)
  }

  requestAccountCreation() {
    const { createAction } = this.props
    if (createAction) createAction()
    else this.setState({ addingAccount: true })
  }

  async endAccountCreation(trigger) {
    this.setState({ addingAccount: false })
    const account = await this.fetchAccount(trigger)

    if (account) {
      this.setState(prevState => ({
        ...prevState,
        accounts: [
          ...prevState.accounts,
          {
            account,
            trigger
          }
        ]
      }))
    }
  }

  async fetchAccounts() {
    const triggers = this.props.konnector.triggers.data
    const { findAccount } = this.props
    this.setState({ fetchingAccounts: true })
    try {
      const accounts = await Promise.all(
        triggers.map(async trigger => {
          return {
            account: await findAccount(triggersModel.getAccountId(trigger)),
            trigger
          }
        })
      )
      this.setState({ accounts, fetchingAccounts: false })
    } catch (error) {
      this.setState({ error, fetchingAccounts: false })
    }
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

  fetchIcon() {
    const { client } = this.context
    const { konnector } = this.props
    return client.stackClient.getIconURL({
      type: 'konnector',
      slug: konnector.slug
    })
  }

  async refetchTrigger() {
    const { fetchTrigger } = this.props
    const { trigger } = this.state

    const upToDateTrigger = await fetchTrigger(trigger._id)
    this.setState({
      trigger: upToDateTrigger
    })
  }

  render() {
    const { dismissAction, konnector, into, t } = this.props
    const { account, accounts } = this.state

    return (
      <Modal
        dismissAction={dismissAction}
        mobileFullscreen
        size="small"
        into={into}
        closable={false}
      >
        <ModalHeader className="u-pr-2">
          <div className="u-flex u-flex-row u-w-100 u-flex-items-center">
            <div className="u-w-3 u-h-3 u-mr-half">
              <AppIcon fetchIcon={this.fetchIcon} />
            </div>
            <div className="u-flex-grow-1 u-mr-half">
              <h3 className="u-title-h3 u-m-0">{konnector.name}</h3>

              {accounts.length > 0 && account && (
                <AccountSelectBox
                  selectedAccount={account}
                  accountList={accounts}
                  onChange={option => {
                    this.requestAccountChange(option.account, option.trigger)
                  }}
                  onCreate={this.requestAccountCreation}
                />
              )}
            </div>
            <Button
              icon={<Icon icon={'cross'} size={'24'} />}
              onClick={dismissAction}
              iconOnly
              label={t('close')}
              subtle
              theme={'secondary'}
            />
          </div>
        </ModalHeader>
        <ModalContent>{this.renderModalContent()}</ModalContent>
      </Modal>
    )
  }

  renderModalContent() {
    const { dismissAction, konnector, t } = this.props
    const {
      account,
      accounts,
      error,
      fetching,
      fetchingAccounts,
      trigger,
      addingAccount
    } = this.state

    if (fetching || fetchingAccounts) {
      return (
        <Spinner
          size="xxlarge"
          className="u-flex u-flex-justify-center u-pv-3"
        />
      )
    } else if (error) {
      return (
        <Infos
          actionButton={
            <Button theme="danger">{t('modal.konnector.error.button')}</Button>
          }
          title={t('modal.konnector.error.title')}
          text={t('modal.konnector.error.description', error)}
          isImportant
        />
      )
    } else if (addingAccount) {
      return (
        <TriggerManager
          konnector={konnector}
          onLoginSuccess={this.endAccountCreation}
          onSuccess={this.endAccountCreation}
        />
      )
    } else if (!account) {
      return (
        <AccountsList
          accounts={accounts}
          konnector={konnector}
          onPick={option => {
            this.requestAccountChange(option.account, option.trigger)
          }}
          addAccount={this.requestAccountCreation}
        />
      )
    } else {
      return (
        <KonnectorConfiguration
          konnector={konnector}
          trigger={trigger}
          account={account}
          onAccountDeleted={dismissAction}
          addAccount={this.requestAccountCreation}
          refetchTrigger={this.refetchTrigger}
        />
      )
    }
  }
}

KonnectorModal.propTypes = {
  into: PropTypes.string,
  konnector: PropTypes.shape({
    slug: PropTypes.string,
    name: PropTypes.string,
    vendor_link: PropTypes.string,
    triggers: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object)
    })
  }),
  findAccount: PropTypes.func,
  fetchTrigger: PropTypes.func,
  dismissAction: PropTypes.func,
  createAction: PropTypes.func,
  onAccountChange: PropTypes.func,
  t: PropTypes.func
}

KonnectorModal.defaultProps = {
  into: 'body'
}

KonnectorModal.contextTypes = {
  client: PropTypes.object.isRequired
}

export default withMutations(accountMutations, triggersMutations)(
  withLocales(KonnectorModal)
)
