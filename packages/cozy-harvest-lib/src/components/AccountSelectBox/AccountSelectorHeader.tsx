import cx from 'classnames'
import React from 'react'

import DialogBackButton from 'cozy-ui/transpiled/react/CozyDialogs/DialogBackButton'
import DialogTitle from 'cozy-ui/transpiled/react/Dialog/DialogTitle'

import AccountSelectBox from './AccountSelectBox'
import { useDialogContext } from '../DialogContext'

interface AccountSelectorHeaderProps {
  konnector: { slug: string }
  account: Record<string, unknown> & { _id: string }
  accountsAndTriggers: (object | null | undefined)[]
  pushHistory: (path: string) => void
  replaceHistory: (path: string) => void
}

export const AccountSelectorHeader = ({
  account,
  accountsAndTriggers,
  pushHistory,
  replaceHistory
}: AccountSelectorHeaderProps): JSX.Element => {
  // @ts-expect-error IDK
  const { dialogTitleProps } = useDialogContext()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { className: dialogTitlePropsClassName, ...rest } = dialogTitleProps

  return (
    <>
      <DialogBackButton
        onClick={(): void => replaceHistory(`/accounts/${account._id}`)}
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
}
