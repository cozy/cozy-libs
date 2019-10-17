import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import AccountsList from './AccountsList/AccountsList'
import KonnectorIcon from './KonnectorIcon'

class AccountsListModal extends React.Component {
  render() {
    const { konnector, accounts, history, t } = this.props
    return (
      <>
        <ModalContent>
          <Stack className="u-mb-3">
            <div className="u-w-3 u-h-3 u-mh-auto">
              <KonnectorIcon konnector={konnector} />
            </div>
            <h3 className="u-title-h3 u-ta-center">
              {t('modal.accounts.title', { name: konnector.name })}
            </h3>
          </Stack>
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
export default withRouter(translate()(AccountsListModal))
