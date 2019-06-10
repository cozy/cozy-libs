import React from 'react'
import PropTypes from 'prop-types'
import { Label } from 'cozy-ui/transpiled/react'

import withLocales from '../../withLocales'

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

export default withLocales(FieldTemplate)
