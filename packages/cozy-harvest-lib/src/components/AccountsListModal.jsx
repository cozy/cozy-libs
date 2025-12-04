import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { translate } from 'twake-i18n'

import DialogTitle from 'cozy-ui/transpiled/react/Dialog/DialogTitle'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Typography from 'cozy-ui/transpiled/react/Typography'

import AccountsList from './AccountsList/AccountsList'
import KonnectorIcon from './KonnectorIcon'

const AccountsListModal = ({ konnector, accounts, t }) => {
  const navigate = useNavigate()
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
          onPick={option =>
            navigate(`accounts/${option.account._id}`, {
              replace: true
            })
          }
          addAccount={() => navigate('new')}
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
