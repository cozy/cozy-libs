import React from 'react'

import { useCozyDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { AccountSelectorHeader } from '../components/AccountSelectBox/AccountSelectorHeader'
import DialogContext from '../components/DialogContext'

const DialogContextApp = ({ children }) => {
  const dialogContext = useCozyDialog({
    size: 'l',
    open: true,
    onClose: null,
    disableTitleAutoPadding: true
  })
  return (
    <DialogContext.Provider value={dialogContext}>
      {children}
    </DialogContext.Provider>
  )
}

const meta = {
  title: 'AccountSelectorHeader',
  component: AccountSelectorHeader,
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' }
  },
  decorators: [
    Story => {
      return (
        <BreakpointsProvider>
          <DialogContextApp>{Story()}</DialogContextApp>
        </BreakpointsProvider>
      )
    }
  ]
}

export default meta

export const Primary = {
  args: {
    konnector: { slug: 'test-konnector' },
    account: { _id: 'test-account' },
    accountsAndTriggers: [{}],
    pushHistory: () => {},
    replaceHistory: () => {}
  }
}
