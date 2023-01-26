import React from 'react'
import PropTypes from 'prop-types'
import DialogContent from '@material-ui/core/DialogContent'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import FlowProvider from '../../FlowProvider'
import TriggerError from '../TriggerError'
import {
  innerAccountModalOverridesProptype,
  intentsApiProptype
} from '../../../helpers/proptypes'

const AccountModalContentWrapper = ({
  children,
  trigger,
  account,
  konnector,
  intentsApi,
  innerAccountModalOverrides
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
              intentsApi={intentsApi}
            />
            {React.Children.map(children, child =>
              React.isValidElement(child)
                ? React.cloneElement(child, {
                    flow,
                    account,
                    trigger,
                    intentsApi,
                    innerAccountModalOverrides
                  })
                : null
            )}
          </>
        )}
      </FlowProvider>
    </DialogContent>
  )
}

AccountModalContentWrapper.propTypes = {
  konnector: PropTypes.object,
  trigger: PropTypes.object,
  account: PropTypes.object,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

export default AccountModalContentWrapper
