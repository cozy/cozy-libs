import React from 'react'

import { useClient } from 'cozy-client'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import IntentIframe from 'cozy-ui/transpiled/react/IntentIframe'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useStepperDialog } from '../Hooks/useStepperDialog'
import StepperDialogTitle from '../StepperDialog/StepperDialogTitle'

const NoteDialog = ({ onClose, onBack }) => {
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const { currentStepIndex } = useStepperDialog()

  return (
    <Dialog
      open
      {...(currentStepIndex > 1 && { transitionDuration: 0 })}
      onClose={onClose}
      onBack={onBack}
      componentsProps={{
        dialogTitle: {
          className: 'u-flex u-flex-justify-between u-flex-items-center'
        }
      }}
      title={<StepperDialogTitle />}
      content={
        <IntentIframe
          action="OPEN"
          type="io.cozy.notes.documents"
          iframeProps={{
            wrapperProps: {
              style: { height: !isMobile && '50vh' }
            }
          }}
          create={client.intents.create}
          onCancel={onClose}
          onTerminate={onClose}
        />
      }
    />
  )
}

export default NoteDialog
