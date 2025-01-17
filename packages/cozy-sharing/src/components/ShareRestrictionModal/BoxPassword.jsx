import PropTypes from 'prop-types'
import React, { useState } from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import List from 'cozy-ui/transpiled/react/List'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Switch from 'cozy-ui/transpiled/react/Switch'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { copyToClipboard } from './helpers'
import { checkIsPermissionHasPassword } from '../../helpers/permissions'
import { useSharingContext } from '../../hooks/useSharingContext'

export const BoxPassword = ({
  file,
  onChange,
  password,
  onToggle,
  toggle,
  helperText,
  inputProps
}) => {
  const { t } = useI18n()
  const { showAlert } = useAlert()
  const [displayHelper, setDisplayHelper] = useState(false)
  const inputRef = React.useRef()
  const { getDocumentPermissions } = useSharingContext()

  const permissions = getDocumentPermissions(file._id)
  const hasPassword = checkIsPermissionHasPassword(permissions)

  const handlePasswordToggle = val => {
    const value = val?.target?.checked ?? val
    onToggle(value)
  }

  const handleChange = val => {
    const value = val?.target?.value ?? val
    onChange(value)
  }
  const handleOnFocus = () => {
    setDisplayHelper(false)
  }
  const handleOnBlur = () => {
    handleChange(inputRef.current.value.trim())
    setDisplayHelper(true)
  }

  const handleCopy = async () => {
    await copyToClipboard(password, { t, showAlert })
  }

  return (
    <Box borderRadius="0.5rem" border="1px solid var(--borderMainColor)">
      <List className="u-p-0">
        <ListItem
          button
          size="large"
          ellipsis={false}
          onClick={() => handlePasswordToggle(!toggle)}
        >
          <ListItemIcon>
            <Icon icon="password" />
          </ListItemIcon>
          <ListItemText primary={t('BoxPassword.text')} />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={toggle}
              onChange={handlePasswordToggle}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      {toggle && (
        <div className="u-pt-half u-ph-1 u-pb-1">
          <TextField
            inputRef={inputRef}
            label={t('BoxPassword.label')}
            {...(hasPassword && {
              placeholder: '****',
              InputLabelProps: {
                shrink: true
              }
            })}
            value={password}
            error={displayHelper && !!helperText}
            helperText={displayHelper && helperText}
            onChange={handleChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
            fullWidth
            type="text"
            variant="outlined"
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleCopy}>
                  <Icon icon="copy" />
                </IconButton>
              )
            }}
            inputProps={inputProps}
          />
        </div>
      )}
    </Box>
  )
}

BoxPassword.propTypes = {
  onChange: PropTypes.func.isRequired,
  password: PropTypes.string,
  onToggle: PropTypes.func.isRequired,
  toggle: PropTypes.bool.isRequired,
  helperText: PropTypes.string,
  inputProps: PropTypes.object
}
