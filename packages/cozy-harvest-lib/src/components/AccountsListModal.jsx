import PropTypes from 'prop-types'
import React, { useContext } from 'react'

import DialogTitle from 'cozy-ui/transpiled/react/Dialog/DialogTitle'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

import AccountsList from './AccountsList/AccountsList'
import KonnectorIcon from './KonnectorIcon'
import { MountPointContext } from './MountPointContext'

const AccountsListModal = ({ konnector, accounts, t }) => {
  const { pushHistory, replaceHistory } = useContext(MountPointContext)
  return (
    <>
      <DialogTitle disableTypography className="u-pt-3 u-pt-2-s">
        <div className="u-w-3 u-h-3 u-mh-auto">
          <KonnectorIcon konnector={konnector} />
        </div>
        <Typography variant="h5" className="u-title-h3 u-ta-center">
          {t('modal.accounts.title', { name: konnector.name })}
        </Typography>
      </DialogTitle>

      <DialogContent>
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
