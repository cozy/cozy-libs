import PropTypes from 'prop-types'
import React from 'react'

import { Label, translate } from 'cozy-ui/transpiled/react'

export const FieldTemplate = ({ children, label, id, t }) => (
  <div>
    {label && <Label htmlFor={id}>{t(label)}</Label>}
    {children}
  </div>
)

FieldTemplate.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  t: PropTypes.func.isRequired
}

export default translate()(FieldTemplate)
