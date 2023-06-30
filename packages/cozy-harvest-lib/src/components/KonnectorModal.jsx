import get from 'lodash/get'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import { withClient } from 'cozy-client'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import {
  useCozyDialog,
  DialogCloseButton
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog, { DialogTitle } from 'cozy-ui/transpiled/react/Dialog'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CrossIcon from 'cozy-ui/transpiled/react/Icons/Cross'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Button from 'cozy-ui/transpiled/react/deprecated/Button'
import Infos from 'cozy-ui/transpiled/react/deprecated/Infos'

import AccountSelectBox from './AccountSelectBox/AccountSelectBox'
import AccountsList from './AccountsList/AccountsList'
import DataTab from './KonnectorConfiguration/DataTab'
import KonnectorAccountWrapper from './KonnectorConfiguration/KonnectorAccountWrapper'
import TriggerManager from './TriggerManager'
import KonnectorUpdateInfos from './infos/KonnectorUpdateInfos'
import { fetchAccount } from '../connections/accounts'
import { fetchTrigger } from '../connections/triggers'
import * as konnectorsModel from '../helpers/konnectors'
import * as triggersModel from '../helpers/triggers'

const DumbKonnectorDialog = ({
  onClose,
  konnector,
  addingAccount,
  account,
  accountsAndTriggers,
  requestAccountCreation,
  requestAccountChange,
  content
}) => {
  const { t } = useI18n()
  const { dialogProps, dialogTitleProps } = useCozyDialog({
    size: 'medium',
    open: true,
    onClose
  })
  return (
    <Dialog {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle {...dialogTitleProps}>
        <div className="u-flex u-flex-row u-w-100 u-flex-items-center">
          <div className="u-w-3 u-h-3 u-mr-half">
            <AppIcon />
          </div>
          <div className="u-flex-grow-1 u-mr-half">
            <h3 className="u-title-h3 u-m-0">{konnector.name}</h3>

            {accountsAndTriggers.length > 0 && account && !addingAccount && (
              <AccountSelectBox
                selectedAccount={account}
                accountsAndTriggers={accountsAndTriggers}
                onChange={option => {
                  requestAccountChange(option.account, option.trigger)
                }}
                onCreate={requestAccountCreation}
              />
            )}
          </div>
          <Button
            icon={<Icon icon={CrossIcon} size="24" />}
            onClick={onClose}
            iconOnly
            label={t('close')}
            subtle
            theme="secondary"
          />
        </div>
      </DialogTitle>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  )
}

const DumbKonnectorDialogContent = props => {
  const { t } = useI18n()
  const {
    onClose,
    konnector,
    account,
    accountsAndTriggers,
    error,
    fetching,
    fetchingAccounts,
    trigger,
    addingAccount,
    requestAccountCreation,
    requestAccountChange,
    refetchTrigger,
    endAccountCreation
  } = props

  if (fetching || fetchingAccounts) {
    return (
      <Spinner size="xxlarge" className="u-flex u-flex-justify-center u-pv-3" />
    )
  } else if (error) {
    return (
      <Infos
        theme="danger"
        description={
          <>
            <Typography variant="h5">
              {t('modal.konnector.error.title')}
            </Typography>
            <Typography variant="body1">
              {t('modal.konnector.error.description', error)}
            </Typography>
          </>
        }
        action={
          <Button theme="danger" label={t('modal.konnector.error.button')} />
        }
      />
    )
  } else if (addingAccount) {
    return (
      <div className="u-pt-1-half">
        <TriggerManager
          konnector={konnector}
          onLoginSuccess={endAccountCreation}
          onSuccess={endAccountCreation}
          onClose={onClose}
        />
      </div>
    )
  } else if (!account) {
    return (
      <>
        {konnectorsModel.hasNewVersionAvailable(konnector) && (
          <KonnectorUpdateInfos className="u-mb-1" konnector={konnector} />
        )}
        <AccountsList
          accounts={accountsAndTriggers}
          konnector={konnector}
          onPick={option => {
            requestAccountChange(option.account, option.trigger)
          }}
          addAccount={requestAccountCreation}
        />
      </>
    )
  } else {
    return (
      <KonnectorAccountWrapper
        konnector={konnector}
        initialTrigger={trigger}
        account={account}
        onAccountDeleted={onClose}
        addAccount={requestAccountCreation}
        refetchTrigger={refetchTrigger}
        Component={DataTab}
      />
    )
  }
}

/**
 * KonnectorModal can be completely standalone and will use it's internal
 * state to switch between views, or it can be controlled by the parents
 * through props (such as accountId) and callbacks (such as createAction
 * and onAccountChange)
 */
export class KonnectorModal extends PureComponent {
  state = {
    account: null,
    fetching: false,
    fetchingAccounts: false,
    addingAccount: false,
    trigger: null,
    error: null,
    accountsAndTriggers: []
  }

  constructor(props) {
    super(props)
    this.refetchTrigger = this.refetchTrigger.bind(this)
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
    const { accountsAndTriggers } = this.state
    if (this.props.accountId) this.loadSelectedAccountId()
    else if (accountsAndTriggers.length === 1) {
      const { account, trigger } = accountsAndTriggers[0]
      this.requestAccountChange(account, trigger)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.accountId && this.props.accountId !== prevProps.accountId) {
      this.loadSelectedAccountId()
    }
  }

  requestAccountChange(account, trigger) {
    // This component can either defer the account switching to a parent component
    // through the onAccountChange prop, or handle the change itself if the prop
    // is missing
    const { onAccountChange } = this.props
    return onAccountChange
      ? onAccountChange(account)
      : this.fetchAccount(trigger)
  }

  loadSelectedAccountId() {
    const selectedAccountId = this.props.accountId
    const { accountsAndTriggers } = this.state
    const matchingTrigger = get(
      accountsAndTriggers.find(
        account => account.account._id === selectedAccountId
      ),
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
        accountsAndTriggers: [
          ...prevState.accountsAndTriggers,
          {
            account,
            trigger
          }
        ]
      }))
    }
  }

  async fetchAccounts() {
    const { client } = this.props
    const triggers = this.props.konnector.triggers.data
    this.setState({ fetchingAccounts: true })
    try {
      const accountsAndTriggers = (
        await Promise.all(
          triggers.map(async trigger => {
            return {
              account: await fetchAccount(
                client,
                triggersModel.getAccountId(trigger)
              ),
              trigger
            }
          })
        )
      ).filter(({ account }) => !!account)
      this.setState({
        accountsAndTriggers,
        fetchingAccounts: false,
        error: null
      })
    } catch (error) {
      this.setState({ error, fetchingAccounts: false })
    }
  }

  async fetchAccount(trigger) {
    const { client } = this.props
    this.setState({ fetching: true })

    try {
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
        fetching: false,
        error: null
      })
    }
  }

  async refetchTrigger() {
    const { client } = this.props
    const { trigger } = this.state

    const upToDateTrigger = await fetchTrigger(client, trigger._id)
    this.setState({
      trigger: upToDateTrigger
    })
  }

  render() {
    const { onClose, konnector } = this.props
    const {
      account,
      accountsAndTriggers,
      addingAccount,
      fetching,
      error,
      trigger
    } = this.state

    return (
      <DumbKonnectorDialog
        onClose={onClose}
        konnector={konnector}
        account={account}
        accountsAndTriggers={accountsAndTriggers}
        addingAccount={addingAccount}
        requestAccountCreation={this.requestAccountCreation}
        requestAccountChange={this.requestAccountChange}
        content={
          <DumbKonnectorDialogContent
            onClose={onClose}
            konnector={konnector}
            account={account}
            accountsAndTriggers={accountsAndTriggers}
            addingAccount={addingAccount}
            error={error}
            fetching={fetching}
            trigger={trigger}
            requestAccountCreation={this.requestAccountCreation}
            requestAccountChange={this.requestAccountChange}
            refetchTrigger={this.refetchTrigger}
            endAccountCreation={this.endAccountCreation}
          />
        }
      />
    )
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
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  createAction: PropTypes.func,
  onAccountChange: PropTypes.func
}

export default withClient(KonnectorModal)
