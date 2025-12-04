import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useI18n } from 'twake-i18n'

import Alert from 'cozy-ui/transpiled/react/Alert'
import Snackbar from 'cozy-ui/transpiled/react/Snackbar'

import ExpandedAttribute from './ExpandedAttribute'
import { makeAttrsLabelAndFormattedValue } from './helpers'
import withListItemLocales from '../hoc/withListItemLocales'

const ExpandedAttributes = ({ doc, expandedAttributes }) => {
  const { t, f, lang } = useI18n()
  const [alertProps, setAlertProps] = useState({
    open: false,
    severity: 'primary',
    message: ''
  })

  const attrsLabelAndFormattedValue = makeAttrsLabelAndFormattedValue({
    doc,
    expandedAttributes,
    t,
    f,
    lang
  })

  const handleClose = () => setAlertProps({ open: false })

  return (
    <>
      {attrsLabelAndFormattedValue.map(({ label, value }, index) => {
        return (
          <ExpandedAttribute
            key={index}
            label={label}
            value={value}
            setAlertProps={setAlertProps}
          />
        )
      })}
      {alertProps.open && (
        <Snackbar open onClose={handleClose}>
          <Alert
            variant="filled"
            severity={alertProps.severity}
            onClose={handleClose}
          >
            {alertProps.message}
          </Alert>
        </Snackbar>
      )}
    </>
  )
}

ExpandedAttributes.propTypes = {
  doc: PropTypes.object,
  expandedAttributes: PropTypes.array
}

export default withListItemLocales(ExpandedAttributes)
