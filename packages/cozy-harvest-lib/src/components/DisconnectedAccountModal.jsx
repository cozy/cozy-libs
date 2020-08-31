import React from 'react'
import { Contracts } from 'cozy-harvest-lib/dist/components/KonnectorConfiguration/ConfigurationTab/Contracts'
import KonnectorModalHeader from 'cozy-harvest-lib/dist/components/KonnectorModalHeader'

import DialogContent from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogContent'
import DialogCloseButton from 'cozy-ui/transpiled/react/MuiCozyTheme/Dialog/DialogCloseButton'
import Dialog, {
  ExperimentalDialogTitle as DialogTitle
} from 'cozy-ui/transpiled/react/Labs/ExperimentalDialog'

import { getAccountInstitutionLabel } from './KonnectorConfiguration/ConfigurationTab/bankAccountHelpers'

const createDummyKonnectorFromAccount = account => {
  return {
    name: getAccountInstitutionLabel(account),
    slug: account.cozyMetadata ? account.cozyMetadata.createdByApp : null
  }
}

/**
 * Serves when configuring vendor accounts whose io.cozy.accounts
 * has been deleted
 */
const DisconnectedModal = ({ accounts, onClose }) => {
  return (
    <Dialog>
      <DialogTitle>
        <KonnectorModalHeader
          konnector={createDummyKonnectorFromAccount(accounts[0])}
        />
      </DialogTitle>
      <DialogCloseButton onClick={onClose} />
      <DialogContent>
        <Contracts contracts={accounts} />
      </DialogContent>
    </Dialog>
  )
}

export default DisconnectedModal
