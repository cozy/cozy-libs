import PropTypes from 'prop-types'
import React, { useContext } from 'react'

import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Stack from 'cozy-ui/transpiled/react/Stack'

import AccountsList from './AccountsList/AccountsList'
import KonnectorIcon from './KonnectorIcon'
import { MountPointContext } from './MountPointContext'

const AccountsListModal = ({ konnector, accounts, t }) => {
  const { pushHistory, replaceHistory } = useContext(MountPointContext)
  return (
    <>
      <DialogContent>
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
          onPick={option => replaceHistory(`/accounts/${option.account._id}`)}
          addAccount={() => pushHistory('/new')}
        />
      </DialogContent>
    </>
  )
}

AccountsListModal.propTypes = {
  konnector: PropTypes.object.isRequired,
  accounts: PropTypes.array.isRequired
}
export default translate()(AccountsListModal)
