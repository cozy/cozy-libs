import React from 'react'
import DialogContent from '@material-ui/core/DialogContent'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import FlowProvider from '../../FlowProvider'
import TriggerError from '../TriggerError'

const AccountModalContentWrapper = ({
  children,
  trigger,
  account,
  konnector
}) => {
  const { isMobile } = useBreakpoints()

  return (
    <DialogContent className={isMobile ? 'u-p-0' : 'u-pt-0'}>
      <FlowProvider initialTrigger={trigger} konnector={konnector}>
        {({ flow }) => (
          <>
            <TriggerError
              flow={flow}
              konnector={konnector}
              account={account}
              trigger={trigger}
            />
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, { flow, trigger, account })
                : null
            )}
          </>
        )}
      </FlowProvider>
    </DialogContent>
  )
}

export default AccountModalContentWrapper
