import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
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

AccountsListModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired
}
export default withRouter(AccountsListModal)
