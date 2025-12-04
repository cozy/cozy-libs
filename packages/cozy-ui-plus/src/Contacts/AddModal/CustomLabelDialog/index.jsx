import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useI18n, useExtendI18n } from 'twake-i18n'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import FormControlLabel from 'cozy-ui/transpiled/react/FormControlLabel'
import RadioGroup from 'cozy-ui/transpiled/react/RadioGroup'
import Radio from 'cozy-ui/transpiled/react/Radios'
import TextField from 'cozy-ui/transpiled/react/TextField'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { locales } from './locales'

const CustomLabelDialog = ({
  customValue,
  setCustomValue,
  customLabelOptions,
  onSubmit,
  onClose
}) => {
  const customValueObj = JSON.parse(customValue || '{}')
  useExtendI18n(locales)
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const [type, setType] = useState(
    customValueObj.type || customLabelOptions.defaultType
  )
  const [label, setLabel] = useState(
    customValueObj.label || customLabelOptions.defaultLabel
  )

  const handleSubmit = () => {
    setCustomValue(JSON.stringify({ type, label }))
    onSubmit({ target: { value: JSON.stringify({ type, label }) } })
    onClose()
  }

  return (
    <ConfirmDialog
      open
      title={t('Contacts.AddModal.CustomLabelDialog.label.custom')}
      content={
        <>
          <TextField
            className="u-mt-half"
            variant="outlined"
            fullWidth
            autoFocus
            value={type}
            onChange={ev => setType(ev.target.value)}
          />
          {!customLabelOptions.hide && (
            <RadioGroup
              style={{ flexDirection: 'row' }}
              className="u-mt-half u-ml-half"
              aria-label="radio"
              name="label"
              value={label}
              onChange={ev => setLabel(ev.target.value)}
            >
              <FormControlLabel
                value="home"
                label={t('Contacts.AddModal.CustomLabelDialog.label.home')}
                control={<Radio />}
              />
              <FormControlLabel
                value="work"
                label={t('Contacts.AddModal.CustomLabelDialog.label.work')}
                control={<Radio />}
              />
            </RadioGroup>
          )}
        </>
      }
      actions={
        <>
          <Button
            variant="secondary"
            fullWidth={isMobile}
            label={t('Contacts.AddModal.CustomLabelDialog.cancel')}
            onClick={onClose}
          />
          <Button
            label={t('Contacts.AddModal.CustomLabelDialog.ok')}
            fullWidth={isMobile}
            disabled={!type}
            onClick={handleSubmit}
          />
        </>
      }
      onClose={onClose}
    />
  )
}

CustomLabelDialog.propTypes = {
  customValue: PropTypes.string,
  setCustomValue: PropTypes.func,
  customLabelOptions: PropTypes.shape({
    hide: PropTypes.bool,
    defaultType: PropTypes.string,
    defaultLabel: PropTypes.string
  }),
  onSubmit: PropTypes.func,
  onClose: PropTypes.func
}

export default CustomLabelDialog
