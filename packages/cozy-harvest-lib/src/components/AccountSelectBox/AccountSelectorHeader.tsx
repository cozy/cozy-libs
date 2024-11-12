import cx from 'classnames'
import React from 'react'
import { useNavigate } from 'react-router-dom'

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
  showAccountSelection: boolean
}

export const AccountSelectorHeader = ({
  account,
  accountsAndTriggers,
  showAccountSelection
}: AccountSelectorHeaderProps): JSX.Element => {
  // @ts-expect-error IDK
  const { dialogTitleProps } = useDialogContext()
  const navigate = useNavigate()

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { className: dialogTitlePropsClassName, ...rest } = dialogTitleProps

  const handleDismiss = (): void => {
    navigate('..', { replace: true })
  }

  const handleChange = (option: { account: { _id: string } }): void => {
    navigate(`../accounts/${option.account._id}`)
  }

  const handleCreate = (): void => {
    navigate(`../new`)
  }

  return (
    <>
      <DialogBackButton onClick={handleDismiss} />
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
            onChange={handleChange}
            onCreate={handleCreate}
            variant="big"
          />
        ) : (
          <Typography>{models.account.getAccountName(account)}</Typography>
        )}
      </DialogTitle>
    </>
  )
}
