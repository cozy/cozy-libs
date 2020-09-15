import React from 'react'
import { withClient, queryConnect } from 'cozy-client'
import { FieldContainer } from 'cozy-ui/transpiled/react/Field'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Label from 'cozy-ui/transpiled/react/Label'

import compose from 'lodash/flowRight'

import { models } from 'cozy-client'
import Switch from 'cozy-ui/transpiled/react/MuiCozyTheme/Switch'

import { createAccountQuerySpec } from '../../../connections/accounts'

import { findKonnectorPolicy } from '../../../konnector-policies'

const { account: accountModel } = models

export class DumbSyncContractSwitch extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      syncStatus: accountModel.DEFAULT_CONTRACT_SYNC_STATUS,
      syncStatusLoading: false
    }
    this.handleSetSyncStatus = this.handleSetSyncStatus.bind(this)
    const stateUpdate = this.checkToUpdateContractState()
    if (stateUpdate) {
      Object.assign(this.state, stateUpdate)
    }
  }

  componentDidUpdate() {
    const stateUpdate = this.checkToUpdateContractState()
    if (stateUpdate) {
      this.setState(stateUpdate)
    }
  }

  checkToUpdateContractState() {
    const { accountCol, contract } = this.props
    if (
      accountCol.fetchStatus === 'loaded' &&
      !this.hasSetSyncStatusFromAccount
    ) {
      this.hasSetSyncStatusFromAccount = true
      const account = accountCol.data
      try {
        const relSyncStatus = accountModel.getContractSyncStatusFromAccount(
          account,
          contract._id
        )
        if (relSyncStatus !== null) {
          return { syncStatus: relSyncStatus }
        }
      } catch (e) {
        return
      }
    }
  }

  async handleSetSyncStatus(ev) {
    ev.preventDefault()
    const { client, konnector, contract, accountCol } = this.props
    const { data: account } = accountCol
    const { syncStatus } = this.state
    const newSyncStatus = !syncStatus
    const policy = findKonnectorPolicy(konnector)
    this.setState({ syncStatus: newSyncStatus, syncStatusLoading: true })
    try {
      await policy.setSync({
        client,
        account,
        konnector,
        contract,
        syncStatus: newSyncStatus
      })
      const updatedAccount = accountModel.setContractSyncStatusInAccount(
        account,
        contract._id,
        newSyncStatus
      )
      await client.save(updatedAccount)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Could not set sync status', e)
    } finally {
      this.setState({ syncStatusLoading: false })
    }
  }

  render() {
    const { accountCol, switchProps, contract, fieldVariant, t } = this.props
    const { syncStatus, syncStatusLoading } = this.state

    if (accountCol.fetchStatus === 'loading') {
      return null
    }

    const account = accountCol.data

    try {
      accountModel.getContractSyncStatusFromAccount(account, contract._id)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(
        `Contract ${contract._id} could not be found in account ${account._id}.`
      )
      return null
    }

    return (
      <FieldContainer variant={fieldVariant}>
        <Label>{t('contractForm.imported')}</Label>
        {/* The span is needed otherwise the switch is not correctly rendered */}
        <span>
          <Switch
            color="primary"
            disabled={syncStatusLoading}
            onClick={this.handleSetSyncStatus}
            checked={syncStatus}
            {...switchProps}
          />
        </span>
      </FieldContainer>
    )
  }
}

const SyncContractSwitch = compose(
  withClient,
  translate(),
  queryConnect({
    accountCol: props => createAccountQuerySpec(props.accountId)
  })
)(DumbSyncContractSwitch)

export default SyncContractSwitch
