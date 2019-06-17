import React from 'react'
import PropTypes from 'prop-types'
import { Input, translate } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'

const InputAdapter = props => (
  <Input
    {...stripInvalidInputProps(props)}
    onChange={e => {
      props.onChange(e.target.value)
    }}
  />
)

InputAdapter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default translate()(InputAdapter)
