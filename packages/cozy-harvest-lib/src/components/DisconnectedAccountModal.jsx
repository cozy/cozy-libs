import React, { useRef } from 'react'
import { Contracts } from 'cozy-harvest-lib/dist/components/KonnectorConfiguration/ConfigurationTab/Contracts'
import KonnectorModalHeader from 'cozy-harvest-lib/dist/components/KonnectorModalHeader'

import { getCreatedByApp } from 'cozy-client/dist/models/utils'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import DialogContent from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogContent'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
import Dialog, {
  ExperimentalDialogTitle as DialogTitle
} from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'

import withLocales from './hoc/withLocales'
import { getAccountInstitutionLabel } from './KonnectorConfiguration/ConfigurationTab/bankAccountHelpers'

const createDummyKonnectorFromAccount = account => {
  return {
    name: getAccountInstitutionLabel(account),
    slug: getCreatedByApp(account) || null
  }
}

/**
 * Serves when configuring vendor accounts whose io.cozy.accounts
 * has been deleted
 */
const DisconnectedModal = ({ accounts, onClose }) => {
  const { t } = useI18n()
  // We keep the konnector in a ref so that when we remove all accounts,
  // we still have a konnector to show the icon
  const konnectorRef = useRef()
  if (!konnectorRef.current) {
    konnectorRef.current = createDummyKonnectorFromAccount(accounts[0])
  }
  return (
    <Dialog>
      <DialogTitle>
        <KonnectorModalHeader konnector={konnectorRef.current} />
      </DialogTitle>
      <DialogCloseButton onClick={onClose} />
      <DialogContent>
        {accounts.length ? (
          <Contracts contracts={accounts} />
        ) : (
          t('contracts.no-contracts')
        )}
      </DialogContent>
    </Dialog>
  )
}

export default withLocales(DisconnectedModal)
