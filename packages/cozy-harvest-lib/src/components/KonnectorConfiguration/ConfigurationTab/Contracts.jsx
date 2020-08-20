import startCase from 'lodash/startCase'

import CozyClient, { Q, queryConnect } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'

import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListSubHeader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubHeader'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'

const makeContractsConn = ({ account, konnector }) => {
  // TODO make it in function of the konnector
  const doctype = 'io.cozy.bank.accounts'
  return {
    query: () =>
      Q(doctype).where({ 'relationships.connection._id': account._id }),
    as: `connection-${account._id}/contracts`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(60 * 1000)
  }
}

const ContractItem = ({ contract }) => {
  return (
    <ListItem
      onClick={() => {
        console.log(contract)
      }}
    >
      <ListItemIcon>
        <Icon icon="wallet" className="u-coolGrey" />
      </ListItemIcon>
      <ListItemText primaryText={startCase(contract.label.toLowerCase())} />
      <ListItemSecondaryAction>
        <Icon icon="right" className="u-coolGrey u-mr-1" />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const DumbContracts = ({ konnector, account, contracts }) => {
  return (
    <MuiCozyTheme>
      <ListSubHeader>Contracts</ListSubHeader>
      <List dense>
        {contracts &&
          contracts.data &&
          contracts.data.map(contract => {
            return <ContractItem key={contract._id} contract={contract} />
          })}
      </List>
    </MuiCozyTheme>
  )
}

export default queryConnect({
  contracts: props => makeContractsConn(props)
})(DumbContracts)
