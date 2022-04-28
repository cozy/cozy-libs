import React, { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'
import DialogActions from 'cozy-ui/transpiled/react/DialogActions'
import useEventListener from 'cozy-ui/transpiled/react/hooks/useEventListener'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useFormData } from '../Hooks/useFormData'
import { FILES_DOCTYPE } from '../../doctypes'
import { KEYS } from '../../constants/const'
import CompositeHeader from '../CompositeHeader/CompositeHeader'
import ConfirmReplaceFile from './widgets/ConfirmReplaceFile'
import ContactList from './ContactList'

const ContactWrapper = ({ currentStep, onClose }) => {
  const { t } = useI18n()
  const client = useClient()
  const { illustration, text } = currentStep
  const { formSubmit, formData } = useFormData()
  const [onLoad, setOnLoad] = useState(false)
  const [confirmReplaceFileModal, setConfirmReplaceFileModal] = useState(false)
  const { isMobile } = useBreakpoints()

  const cozyFiles = formData.data.filter(d => d.file.constructor === Blob)

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
    if (key === KEYS.ENTER) handleClick()
  }

  useEventListener(window, 'keydown', handleKeyDown)

  return (
    <>
      <CompositeHeader
        icon={illustration}
        iconSize={'small'}
        title={t(text)}
        text={<ContactList />}
      />
      <DialogActions
        disableSpacing
        className={cx('columnLayout u-mb-1-half u-mt-0 cozyDialogActions', {
          'u-mh-1': !isMobile,
          'u-mh-0': isMobile
        })}
      >
        <Button
          fullWidth
          label={t(!onLoad ? 'ContactStep.save' : 'ContactStep.onLoad')}
          onClick={handleClick}
          disabled={onLoad}
          busy={onLoad}
        />
      </DialogActions>

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

ContactWrapper.propTypes = {
  currentStep: PropTypes.shape({
    illustration: PropTypes.string,
    text: PropTypes.string
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default ContactWrapper
