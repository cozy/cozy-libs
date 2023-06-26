import cx from 'classnames'
import React from 'react'

import { models } from 'cozy-client'
import type { IOCozyAccount } from 'cozy-client/types/types'
import DialogBackButton from 'cozy-ui/transpiled/react/CozyDialogs/DialogBackButton'
import DialogTitle from 'cozy-ui/transpiled/react/Dialog/DialogTitle'
import Typography from 'cozy-ui/transpiled/react/Typography'

import AccountSelectBox from './AccountSelectBox'
import { useDialogContext } from '../DialogContext'

export interface AccountSelectorHeaderProps {
  konnector: { slug: string }
  account: IOCozyAccount
  accountsAndTriggers: (object | null | undefined)[]
  pushHistory: (path: string) => void
  replaceHistory: (path: string) => void
  showAccountSelection: boolean
}

export const AccountSelectorHeader = ({
  account,
  accountsAndTriggers,
  pushHistory,
  replaceHistory,
  showAccountSelection
}: AccountSelectorHeaderProps): JSX.Element => {
  // @ts-expect-error IDK
  const { dialogTitleProps } = useDialogContext()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { className: dialogTitlePropsClassName, ...rest } = dialogTitleProps

  return (
    <>
      <DialogBackButton
        onClick={(): void => replaceHistory(`/accounts/${String(account._id)}`)}
      />

      <DialogTitle
        {...rest}
        className={cx(
          'dialogTitleWithBack dialogTitleWithClose',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          dialogTitlePropsClassName
        )}
        disableTypography
      >
        {showAccountSelection ? (
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
        ) : (
          <Typography>{models.account.getAccountName(account)}</Typography>
        )}
      </DialogTitle>
    </>
  )
}
