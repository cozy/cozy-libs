import PropTypes from 'prop-types'
import React from 'react'

import DialogContent from 'cozy-ui/transpiled/react/Dialog/DialogContent'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import {
  innerAccountModalOverridesProptype,
  intentsApiProptype
} from '../../../helpers/proptypes'
import FlowProvider from '../../FlowProvider'

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

AccountModalContentWrapper.propTypes = {
  konnector: PropTypes.object,
  trigger: PropTypes.object,
  account: PropTypes.object,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

export default AccountModalContentWrapper
