import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { Dialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'

import ContactList from './ContactList'
import ConfirmReplaceFile from './widgets/ConfirmReplaceFile'
import { KEYS } from '../../constants/const'
import { FILES_DOCTYPE } from '../../doctypes'
import { fetchCurrentUser } from '../../helpers/fetchCurrentUser'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import { useFormData } from '../Hooks/useFormData'
import { useStepperDialog } from '../Hooks/useStepperDialog'
import StepperDialogTitle from '../StepperDialog/StepperDialogTitle'

const ContactDialog = ({ currentStep, onClose, onBack }) => {
  const { t } = useI18n()
  const client = useClient()
  const { currentStepIndex } = useStepperDialog()
  const { formSubmit, formData } = useFormData()
  const [onLoad, setOnLoad] = useState(false)
  const [confirmReplaceFileModal, setConfirmReplaceFileModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [contactIdsSelected, setContactIdsSelected] = useState([])
  const [contactModalOpened, setContactModalOpened] = useState(false)
  const { illustration, text, multiple } = currentStep

  const cozyFiles = formData.data.filter(d => d.file.constructor === Blob)
  const saveButtonDisabled =
    onLoad || contactIdsSelected.length === 0 || contactModalOpened

  const closeConfirmReplaceFileModal = () => setConfirmReplaceFileModal(false)
  const openConfirmReplaceFileModal = () => setConfirmReplaceFileModal(true)

  const submit = async () => {
    setOnLoad(true)
    await formSubmit()
    onClose()
  }

  const onClickReplace = async isFileReplaced => {
    if (isFileReplaced) {
      for (const { file } of cozyFiles) {
        await client.destroy({ _id: file.id, _type: FILES_DOCTYPE })
      }
    }
    submit()
  }

  const handleClick = () => {
    if (cozyFiles.length > 0) {
      if (!confirmReplaceFileModal) openConfirmReplaceFileModal()
      else onClickReplace(true)
    } else {
      submit()
    }
  }

  const handleKeyDown = ({ key }) => {
    if (saveButtonDisabled) {
      return
    }
    if (key === KEYS.ENTER) {
      handleClick()
    }
  }

  useEventListener(window, 'keydown', handleKeyDown)

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
        {...(currentStepIndex > 1 && { transitionDuration: 0, onBack })}
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
          <Button
            fullWidth
            label={t(!onLoad ? 'ContactStep.save' : 'ContactStep.onLoad')}
            onClick={handleClick}
            disabled={saveButtonDisabled}
            busy={onLoad}
            data-testid="ButtonSave"
          />
        }
      />
      {confirmReplaceFileModal && (
        <ConfirmReplaceFile
          onClose={closeConfirmReplaceFileModal}
          onReplace={onClickReplace}
          cozyFilesCount={cozyFiles.length}
        />
      )}
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
  onBack: PropTypes.func
}

export default ContactDialog
