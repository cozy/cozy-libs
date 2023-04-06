import React from 'react'

import DialogBackButton from 'cozy-ui/transpiled/react/CozyDialogs/DialogBackButton'
import DialogTitle from 'cozy-ui/transpiled/react/Dialog/DialogTitle'

import AccountSelectBox from './AccountSelectBox'

interface AccountSelectorHeaderProps {
  konnector: { slug: string }
  account: Record<string, unknown>
  accountsAndTriggers: (object | null | undefined)[]
  pushHistory: (path: string) => void
}

export const AccountSelectorHeader = ({
  konnector,
  account,
  accountsAndTriggers,
  pushHistory
}: AccountSelectorHeaderProps): JSX.Element => (
  <>
    <DialogBackButton
      onClick={(): void =>
        pushHistory(`/connected/${konnector.slug}/accounts/:accountId`)
      }
    />
    <DialogTitle
      className="dialogTitleWithBack dialogTitleWithClose"
      disableTypography
    >
      <AccountSelectBox
        loading={!account}
        selectedAccount={account}
        accountsAndTriggers={accountsAndTriggers}
        onChange={(option: { account: { _id: string } }): void => {
          pushHistory(`/accounts/${option.account._id}`)
        }}
        onCreate={(): void => {
          pushHistory('/new')
        }}
        variant="big"
      />
    </DialogTitle>
  </>
)
