import React from 'react'
import { useOutletContext } from 'react-router-dom'

import DialogContent from 'cozy-ui/transpiled/react/Dialog/DialogContent'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import FlowProvider from '../FlowProvider'

const AccountModalContentWrapper = ({ children }) => {
  const { isMobile } = useBreakpoints()
  const {
    konnector,
    account,
    trigger,
    intentsApi,
    innerAccountModalOverrides
  } = useOutletContext()

  return (
    <DialogContent className={isMobile ? 'u-p-0' : 'u-pt-0'}>
      <FlowProvider initialTrigger={trigger} konnector={konnector}>
        {({ flow }) =>
          React.Children.map(children, child =>
            React.isValidElement(child)
              ? React.cloneElement(child, {
                  flow,
                  account,
                  trigger,
                  intentsApi,
                  innerAccountModalOverrides
                })
              : null
          )
        }
      </FlowProvider>
    </DialogContent>
  )
}

export default AccountModalContentWrapper
