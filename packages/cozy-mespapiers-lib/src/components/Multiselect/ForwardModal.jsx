import addDays from 'date-fns/addDays'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import { useClient } from 'cozy-client'
import { isNote } from 'cozy-client/dist/models/file'
import { getSharingLink } from 'cozy-client/dist/models/sharing'
import { isMobile } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { FileImageLoader } from 'cozy-ui/transpiled/react/FileImageLoader'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import BoxDate from './BoxDate'
import BoxPassword from './BoxPassword'
import { copyToClipboard } from '../../helpers/copyToClipboard'
import { makeTTL } from '../../helpers/makeTTL'
import { forwardFile } from '../Actions/utils'

const styles = {
  image: {
    maxHeight: 64,
    maxWidth: 64
  }
}

const PASSWORD_MIN_LENGTH = 4

const ForwardModal = ({ onClose, onForward, file }) => {
  const client = useClient()
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const modalContentRef = useRef(null)
  const [password, setPassword] = useState('')
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 30))
  const [isValidDate, setIsValidDate] = useState(true)
  const [isValidPassword, setIsValidPassword] = useState(true)
  const [dateToggle, setDateToggle] = useState(true)
  const [passwordToggle, setPasswordToggle] = useState(false)

  const isDesktopOrMobileWithoutShareAPI =
    (isMobile() && !navigator.share) || !isMobile()

  // The .zip is made from 2 or more files, we need this distinction for pluralization
  const isMultipleFile = file.mime === 'application/zip' ? 2 : 1

  // #region Handle BoxPassword
  const handlePasswordToggle = val => {
    setPasswordToggle(val)
  }
  const handlePassword = evt => {
    const value = evt.target.value
    setPassword(value)
    setIsValidPassword(
      value.length === 0 || value.length >= PASSWORD_MIN_LENGTH
    )
  }
  const helperTextPassword = !isValidPassword
    ? t('InputTextAdapter.invalidTextMessage', {
        smart_count: PASSWORD_MIN_LENGTH - password.length
      })
    : null
  // #endregion

  // #region Handle BoxDate
  const handleDateToggle = val => {
    setDateToggle(val)
  }
  const handleDateChange = value => {
    if (value?.toString() !== 'Invalid Date') {
      setIsValidDate(true)
      setSelectedDate(value)
    } else if (value === '') {
      setIsValidDate(true)
      setSelectedDate(null)
    } else {
      setIsValidDate(false)
      setSelectedDate(null)
    }
  }
  const helperTextDate = !isValidDate
    ? t('InputDateAdapter.invalidDateMessage')
    : null
  // #endregion

  const handleClick = async () => {
    const ttl = makeTTL(dateToggle && selectedDate)
    if (isDesktopOrMobileWithoutShareAPI) {
      const url = await getSharingLink(client, [file._id], {
        ttl,
        password
      })
      copyToClipboard(url, { target: modalContentRef.current, t, showAlert })
      onForward?.()
    } else {
      await forwardFile(client, [file], t, { ttl, password })
      onForward?.()
    }
  }

  const textContent = isDesktopOrMobileWithoutShareAPI
    ? t('ForwardModal.content.desktop', {
        smart_count: isMultipleFile
      })
    : t('ForwardModal.content.mobile', {
        smart_count: isMultipleFile
      })
  const textAction = isDesktopOrMobileWithoutShareAPI
    ? t('ForwardModal.action.desktop')
    : t('ForwardModal.action.mobile')

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      data-testid="ForwardModal"
      content={
        <>
          <div className="u-ta-center u-mb-1" ref={modalContentRef}>
            <FileImageLoader
              client={client}
              file={file}
              linkType="tiny"
              render={src => {
                return src ? (
                  <img src={src} alt="" style={styles.image} />
                ) : (
                  <Skeleton variant="rect" animation="wave" />
                )
              }}
              renderFallback={() => (
                <Icon
                  icon={isNote(file) ? 'file-type-note' : 'file-type-zip'}
                  size={64}
                />
              )}
            />
            <Typography variant="h5" className="u-mv-1">
              {file.name}
            </Typography>
            <Typography>{textContent}</Typography>
          </div>
          <BoxDate
            onChange={handleDateChange}
            date={selectedDate}
            onToggle={handleDateToggle}
            toggle={dateToggle}
            helperText={helperTextDate}
          />
          <BoxPassword
            onChange={handlePassword}
            password={password}
            onToggle={handlePasswordToggle}
            toggle={passwordToggle}
            helperText={helperTextPassword}
            inputProps={{ minLength: PASSWORD_MIN_LENGTH }}
          />
        </>
      }
      actions={
        <Button
          label={textAction}
          onClick={handleClick}
          disabled={!isValidDate || !isValidPassword}
        />
      }
    />
  )
}

ForwardModal.propTypes = {
  onForward: PropTypes.func,
  onClose: PropTypes.func,
  file: PropTypes.object
}

export default ForwardModal
