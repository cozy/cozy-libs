import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import AccountsList from './AccountsList/AccountsList'
import KonnectorIcon from './KonnectorIcon'
import { MountPointContext } from './MountPointContext'

const AccountsListModal = ({ konnector, accounts, t }) => {
  const { pushHistory } = useContext(MountPointContext)
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
          onPick={option => pushHistory(`/accounts/${option.account._id}`)}
          addAccount={() => pushHistory('/new')}
        />
      </ModalContent>
    </>
  )
}

AccountsListModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired
}
export default translate()(AccountsListModal)
