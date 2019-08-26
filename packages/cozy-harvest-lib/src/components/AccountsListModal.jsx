import React from 'react'
import { withRouter } from 'react-router-dom'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import AccountsList from './AccountsList/AccountsList'
import KonnectorModalHeader from './KonnectorModalHeader'

class AccountsListModal extends React.Component {
  render() {
    const { konnector, accounts, history } = this.props

    return (
      <>
        <KonnectorModalHeader konnector={konnector} />
        <ModalContent>
          <AccountsList
            accounts={accounts}
            konnector={konnector}
            onPick={option => history.push(`./accounts/${option.account._id}`)}
            addAccount={() => history.push('./new')}
          />
        </ModalContent>
      </>
    )
  }
}

export default withRouter(AccountsListModal)
