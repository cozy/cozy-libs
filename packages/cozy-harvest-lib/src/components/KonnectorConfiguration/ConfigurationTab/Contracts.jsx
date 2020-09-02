import React, { useState } from 'react'
import PropTypes from 'prop-types'
import startCase from 'lodash/startCase'
import compose from 'lodash/flowRight'

import CozyClient, { Q, queryConnect } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'

import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { getAccountLabel } from './bankAccountHelpers'
import EditContractModal from './EditContract'

import withLocales from '../../hoc/withLocales'

const makeContractsConn = ({ account }) => {
  const doctype = 'io.cozy.bank.accounts'
  return {
    query: () =>
      Q(doctype).where({ 'relationships.connection.data._id': account._id }),
    as: `connection-${account._id}/contracts`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
  }
}

const getPrimaryTextPerDoctype = {
  'io.cozy.bank.accounts': getAccountLabel
}

const getPrimaryTextDefault = contract => contract.label

const ContractItem = ({ contract }) => {
  const [showingEditModal, setShowingEditModal] = useState(false)
  const getPrimaryText =
    getPrimaryTextPerDoctype[contract._type] || getPrimaryTextDefault
  const { t } = useI18n()
  return (
    <>
      <ListItem
        className="u-c-pointer"
        onClick={() => {
          setShowingEditModal(true)
        }}
      >
        <ListItemIcon>
          <Icon icon="wallet" className="u-slateGrey" />
        </ListItemIcon>
        <ListItemText
          primaryText={startCase(getPrimaryText(contract).toLowerCase())}
          secondaryText={contract._deleted ? t('contracts.deleted') : null}
        />
        <ListItemSecondaryAction>
          <Icon icon="right" className="u-coolGrey u-mr-1" />
        </ListItemSecondaryAction>
      </ListItem>
      {showingEditModal ? (
        <EditContractModal
          contract={contract}
          dismissAction={() => {
            setShowingEditModal(false)
          }}
          onSuccess={() => {
            setShowingEditModal(false)
          }}
          onCancel={() => {
            setShowingEditModal(false)
          }}
          onAfterRemove={() => {
            setShowingEditModal(false)
          }}
        />
      ) : null}
    </>
  )
}

const customHeaderPerDoctype = {
  'io.cozy.bank.accounts': 'bankAccounts'
}

const DumbContracts = ({ contracts, doctype }) => {
  const contractData = contracts.data ? contracts.data : contracts
  const { t } = useI18n()
  const headerKey = customHeaderPerDoctype[doctype] || 'default'
  return contractData.length > 0 ? (
    <MuiCozyTheme>
      <ListSubheader>{t(`contracts.headers.${headerKey}`)}</ListSubheader>
      <List dense>
        {contractData &&
          contractData.map(contract => {
            return <ContractItem key={contract._id} contract={contract} />
          })}
      </List>
    </MuiCozyTheme>
  ) : null
}

const CollectionPropType = PropTypes.shape({
  fetchStatus: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  lastUpdate: PropTypes.bool.isRequired
})

DumbContracts.propTypes = {
  contracts: PropTypes.oneOfType([CollectionPropType, PropTypes.array])
}

export const ContractsForAccount = compose(
  withLocales,
  queryConnect({
    contracts: props => makeContractsConn(props)
  })
)(DumbContracts)

export const Contracts = withLocales(DumbContracts)
