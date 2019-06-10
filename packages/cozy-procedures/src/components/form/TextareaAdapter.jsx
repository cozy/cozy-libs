import React from 'react'
import PropTypes from 'prop-types'
import { Textarea } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'

const TextareaAdapter = props => (
  <Textarea
    {...stripInvalidInputProps(props)}
    onChange={e => {
      props.onChange(e.target.value)
    }}
  />
)

TextareaAdapter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default TextareaAdapter
