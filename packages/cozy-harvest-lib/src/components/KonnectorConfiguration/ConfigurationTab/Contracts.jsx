import React from 'react'
import PropTypes from 'prop-types'
import compose from 'lodash/flowRight'

import CozyClient, { Q, queryConnect } from 'cozy-client'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import NavigationList, {
  NavigationListSection,
  NavigationListHeader
} from 'cozy-ui/transpiled/react/NavigationList'

import withLocales from '../../hoc/withLocales'
import BIContractActivationWindow from './BiContractActivationWindow'
import { intentsApiProptype } from '../../../helpers/proptypes'
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
