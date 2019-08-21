import React from 'react'
import { withRouter } from 'react-router-dom'
import Modal, {
  ModalContent,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import AccountsList from './AccountsList/AccountsList'
import KonnectorIcon from './KonnectorIcon'

class AccountsListModal extends React.Component {
  render() {
    const { dismissAction, konnector, accounts, history } = this.props

    return (
      <Modal dismissAction={dismissAction} mobileFullscreen size="small">
        <ModalHeader className="u-pr-2">
          <div className="u-flex u-flex-row u-w-100 u-flex-items-center">
            <div className="u-w-3 u-h-3 u-mr-half">
              <KonnectorIcon konnector={konnector} />
            </div>
            <div className="u-flex-grow-1 u-mr-half">
              <h3 className="u-title-h3 u-m-0">{konnector.name}</h3>
            </div>
          </div>
        </ModalHeader>
        <ModalContent>
          <AccountsList
            accounts={accounts}
            konnector={konnector}
            onPick={option => history.push(`./accounts/${option.account._id}`)}
            addAccount={() => history.push('./new')}
          />
        </ModalContent>
      </Modal>
    )
  }
}

export default withRouter(AccountsListModal)
