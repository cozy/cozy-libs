import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ContactList from './ContactList'
import SubmitButton from './widgets/SubmitButton'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import StepperDialogTitle from '../StepperDialog/StepperDialogTitle'

const ContactDialog = ({ currentStep, onClose, onBack, onSubmit }) => {
  const { t } = useI18n()
  const client = useClient()
  const { currentStepIndex, nextStep, isLastStep } = useStepperDialog()
  const [currentUser, setCurrentUser] = useState(null)
  const [contactIdsSelected, setContactIdsSelected] = useState([])
  const [contactModalOpened, setContactModalOpened] = useState(false)
  const { illustration, text, multiple } = currentStep

  const SubmitButtonComponent = isLastStep() ? SubmitButton : null
  const buttonDisabled = contactIdsSelected.length === 0 || contactModalOpened

  useEffect(() => {
    const init = async () => {
      const myself = await fetchCurrentUser(client)
      setCurrentUser(myself)
    }
    init()
  }, [client])

  return (
    <>
      <Dialog
        open
        {...(currentStepIndex > 0 && { transitionDuration: 0, onBack })}
        onClose={onClose}
        componentsProps={{
          dialogTitle: {
            className: 'u-flex u-flex-justify-between u-flex-items-center'
          }
        }}
        title={<StepperDialogTitle />}
        content={
          <CompositeHeader
            icon={illustration}
            iconSize="small"
            title={t(text)}
            text={
              currentUser && (
                <ContactList
                  multiple={multiple}
                  currentUser={currentUser}
                  contactIdsSelected={contactIdsSelected}
                  setContactIdsSelected={setContactIdsSelected}
                  contactModalOpened={contactModalOpened}
                  setContactModalOpened={setContactModalOpened}
                />
              )
            }
          />
        }
        actions={
          SubmitButtonComponent ? (
            <SubmitButtonComponent
              onSubmit={onSubmit}
              disabled={buttonDisabled}
            />
          ) : (
            <Button
              data-testid="next-button"
              fullWidth
              label={t('common.next')}
              disabled={buttonDisabled}
              onClick={nextStep}
            />
          )
        }
      />
    </>
  )
}

ContactDialog.propTypes = {
  currentStep: PropTypes.shape({
    illustration: PropTypes.string,
    text: PropTypes.string,
    multiple: PropTypes.bool
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onBack: PropTypes.func,
  onSubmit: PropTypes.func
}

export default ContactDialog
