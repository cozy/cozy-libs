import PropTypes from 'prop-types'
import React from 'react'

import { Button } from 'cozy-ui/transpiled/react/deprecated/Button'

const ShareSubmit = props => (
  <Button
    onClick={() => {
      props.onSubmit()
    }}
    busy={props.loading}
    label={props.label}
    disabled={props.disabled}
  />
)

ShareSubmit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
}

ShareSubmit.defaultProps = {
  label: 'Submit',
  loading: false
}

export default ShareSubmit
