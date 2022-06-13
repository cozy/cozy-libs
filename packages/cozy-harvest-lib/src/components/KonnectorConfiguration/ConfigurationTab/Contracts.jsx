import React, { useState } from 'react'
import PropTypes from 'prop-types'
import startCase from 'lodash/startCase'
import compose from 'lodash/flowRight'

import CozyClient, { Q, queryConnect } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'

import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NavigationList, {
  NavigationListSection,
  NavigationListHeader
} from 'cozy-ui/transpiled/react/NavigationList'
import WalletIcon from 'cozy-ui/transpiled/react/Icons/Wallet'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'

import withLocales from '../../hoc/withLocales'
import { getAccountLabel } from './bankAccountHelpers'
import EditContract from './EditContract'
import BIContractActivationWindow from './BiContractActivationWindow'
import { intentsApiProptype } from '../../../helpers/proptypes'

const makeContractsConn = ({ account }) => {
  const doctype = 'io.cozy.bank.accounts'
  return {
    query: () =>
      Q(doctype)
        .where({ 'relationships.connection.data._id': account._id })
        .include(['owners'])
        .indexFields(['relationships.connection.data._id']),
    as: `connection-${account._id}/contracts`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
  }
}

const getPrimaryTextPerDoctype = {
  'io.cozy.bank.accounts': getAccountLabel
}

const getPrimaryTextDefault = contract => contract.label

const ContractItem = ({ contract, konnector, accountId, divider }) => {
  const [showingEditModal, setShowingEditModal] = useState(false)
  const { t } = useI18n()
  const getPrimaryText =
    getPrimaryTextPerDoctype[contract._type] || getPrimaryTextDefault

  return (
    <>
      <ListItem
        button
        divider={divider}
        className="u-c-pointer"
        onClick={() => {
          setShowingEditModal(true)
        }}
      >
        <ListItemIcon>
          <Icon icon={WalletIcon} className="u-slateGrey" />
        </ListItemIcon>
        <ListItemText
          primary={startCase(getPrimaryText(contract).toLowerCase())}
          secondary={contract._deleted ? t('contracts.deleted') : null}
        />
        <ListItemSecondaryAction>
          <Icon icon={RightIcon} className="u-coolGrey u-mr-1" />
        </ListItemSecondaryAction>
      </ListItem>
      {showingEditModal && (
        <EditContract
          konnector={konnector}
          accountId={accountId}
          contract={contract}
          onSuccess={() => {
            setShowingEditModal(false)
          }}
          onClose={() => {
            setShowingEditModal(false)
          }}
          onAfterRemove={() => {
            setShowingEditModal(false)
          }}
        />
      )}
    </>
  )
}

const customHeaderPerDoctype = {
  'io.cozy.bank.accounts': 'bankAccounts'
}

const DumbContracts = ({ contracts, account, konnector, intentsApi }) => {
  const { t } = useI18n()
  const contractData = contracts.data ? contracts.data : contracts

  if (contractData.length === 0) return null

  const doctype = contractData[0] ? contractData[0]._type : null
  const headerKey = customHeaderPerDoctype[doctype] || 'default'

  return (
    <MuiCozyTheme>
      <NavigationList>
        <NavigationListHeader>
          {t(`contracts.headers.${headerKey}`)}
        </NavigationListHeader>
        <NavigationListSection>
          {contractData &&
            contractData.map((contract, i) => {
              return (
                <ContractItem
                  key={contract._id}
                  konnector={konnector}
                  accountId={account ? account._id : null}
                  contract={contract}
                  divider={i !== contractData.length - 1}
                />
              )
            })}
          <BIContractActivationWindow
            konnector={konnector}
            account={account}
            intentsApi={intentsApi}
          />
        </NavigationListSection>
      </NavigationList>
    </MuiCozyTheme>
  )
}

const CollectionPropType = PropTypes.shape({
  fetchStatus: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
})

DumbContracts.propTypes = {
  contracts: PropTypes.oneOfType([CollectionPropType, PropTypes.array]),
  /** Can be present if showing contracts still linked to an account/konnector/trigger */
  account: PropTypes.object,
  /** Can be present if showing contracts still linked to an account/konnector/trigger */
  konnector: PropTypes.object,
  /** custom intents api. Can have fetchSessionCode, showInAppBrowser, closeInAppBrowser at the moment */
  intentsApi: intentsApiProptype
}

export const ContractsForAccount = compose(
  withLocales,
  queryConnect({
    contracts: makeContractsConn
  })
)(DumbContracts)

export const Contracts = withLocales(DumbContracts)
