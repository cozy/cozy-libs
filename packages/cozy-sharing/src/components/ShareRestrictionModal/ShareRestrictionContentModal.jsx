import { addDays, isValid } from 'date-fns'
import PropTypes from 'prop-types'
import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { BoxDate } from './BoxDate'
import { BoxEditingRights } from './BoxEditingRights'
import { BoxPassword } from './BoxPassword'
import { checkIsPermissionHasPassword } from '../../helpers/permissions'
import { useSharingContext } from '../../hooks/useSharingContext'

const PASSWORD_MIN_LENGTH = 4

export const ShareRestrictionContentModal = ({
  file,
  // Date
  selectedDate,
  setSelectedDate,
  dateToggle,
  setDateToggle,
  setIsValidDate,
  // Password
  helperTextPassword,
  password,
  setPassword,
  passwordToggle,
  setPasswordToggle,
  setIsValidPassword,
  // Editing rights
  editingRights,
  setEditingRights
}) => {
  const { t } = useI18n()
  const { getDocumentPermissions } = useSharingContext()
  const permissions = getDocumentPermissions(file._id)
  const hasPassword = checkIsPermissionHasPassword(permissions)

  const handlePassword = value => {
    setPassword(value)
    setIsValidPassword(
      (hasPassword && value.trim().length === 0) ||
        value.trim().length >= PASSWORD_MIN_LENGTH
    )
  }

  const handlePasswordToggle = val => {
    setPasswordToggle(val)
    setPassword('')
    if (val && !password) {
      setIsValidPassword(hasPassword)
    } else {
      setIsValidPassword(true)
    }
  }

  const handleDate = date => {
    setSelectedDate(date)
    setIsValidDate(isValid(date))
  }

  const handleDateToggle = val => {
    setDateToggle(val)
    if (!val) {
      setSelectedDate(null)
      setIsValidDate(true)
    } else {
      const defaultValue = val ? addDays(new Date(), 30) : null
      setSelectedDate(defaultValue)
      setIsValidDate(true)
    }
  }

  return (
    <Box display="flex" flexDirection="column" gridGap="1rem">
      <Typography variant="h4" className="u-mb-half u-ml-half">
        {t('ShareRestrictionModal.title')}
      </Typography>

      <BoxEditingRights
        file={file}
        editingRights={editingRights}
        setEditingRights={setEditingRights}
      />
      <BoxDate
        onChange={handleDate}
        date={selectedDate}
        onToggle={handleDateToggle}
        toggle={dateToggle}
      />
      <BoxPassword
        file={file}
        onChange={handlePassword}
        password={password}
        onToggle={handlePasswordToggle}
        toggle={passwordToggle}
        helperText={helperTextPassword}
        inputProps={{ minLength: PASSWORD_MIN_LENGTH }}
      />
    </Box>
  )
}

ShareRestrictionContentModal.propTypes = {
  file: PropTypes.object.isRequired,
  // Date
  selectedDate: PropTypes.object,
  setSelectedDate: PropTypes.func.isRequired,
  dateToggle: PropTypes.bool,
  setDateToggle: PropTypes.func.isRequired,
  setIsValidDate: PropTypes.func.isRequired,
  // Password
  helperTextPassword: PropTypes.string,
  password: PropTypes.string,
  setPassword: PropTypes.func.isRequired,
  passwordToggle: PropTypes.bool.isRequired,
  setPasswordToggle: PropTypes.func.isRequired,
  setIsValidPassword: PropTypes.func.isRequired,
  // Editing rights
  editingRights: PropTypes.oneOf(['readOnly', 'write']),
  setEditingRights: PropTypes.func.isRequired
}
