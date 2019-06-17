import React from 'react'
import PropTypes from 'prop-types'
import { Label, translate } from 'cozy-ui/transpiled/react'

const FieldTemplate = ({ children, label, id, t }) => (
  <div>
    {label && <Label htmlFor={id}>{t(label)}</Label>}
    {children}
  </div>
)

FieldTemplate.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  label: PropTypes.string
}

export default translate()(FieldTemplate)
