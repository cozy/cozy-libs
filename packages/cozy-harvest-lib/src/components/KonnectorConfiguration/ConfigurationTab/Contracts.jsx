// @ts-check
import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import CozyClient, { Q, queryConnect, RealTimeQueries } from 'cozy-client'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NavigationList, {
  NavigationListSection,
  NavigationListHeader
} from 'cozy-ui/transpiled/react/NavigationList'
import flag from 'cozy-flags'

import withLocales from '../../hoc/withLocales'
import BIContractActivationWindow from './BiContractActivationWindow'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../../helpers/proptypes'
import ContractItem from './ContractItem'

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

const customHeaderPerDoctype = {
  'io.cozy.bank.accounts': 'bankAccounts'
}

const DumbContracts = ({
  contracts,
  account,
  konnector,
  intentsApi,
  innerAccountModalOverrides,
  onAccountDeleted
}) => {
  const { t } = useI18n()
  const contractData = contracts.data ? contracts.data : contracts

  if (contractData.length === 0) return null

  const doctype = contractData[0] ? contractData[0]._type : null
  const headerKey = customHeaderPerDoctype[doctype] || 'default'

  return (
    <MuiCozyTheme>
      <RealTimeQueries doctype="io.cozy.bank.accounts" />
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
          {flag('harvest.bi.webview') && (
            <BIContractActivationWindow
              konnector={konnector}
              account={account}
              intentsApi={intentsApi}
              innerAccountModalOverrides={innerAccountModalOverrides}
              onAccountDeleted={onAccountDeleted}
            />
          )}
        </NavigationListSection>
      </NavigationList>
    </MuiCozyTheme>
  )
}

export const CollectionPropType = PropTypes.shape({
  fetchStatus: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
})

DumbContracts.propTypes = {
  contracts: PropTypes.oneOfType([CollectionPropType, PropTypes.array]),
  /** Can be present if showing contracts still linked to an account/konnector/trigger */
  account: PropTypes.object,
  /** Can be present if showing contracts still linked to an account/konnector/trigger */
  konnector: PropTypes.object,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype,
  /** What to do when the current account is deleted */
  onAccountDeleted: PropTypes.func
}

export const ContractsForAccount = compose(
  withLocales,
  // @ts-ignore Aucune surcharge ne correspond à cet appel
  queryConnect({
    contracts: makeContractsConn
  })
)(DumbContracts)

export const Contracts = withLocales(DumbContracts)
