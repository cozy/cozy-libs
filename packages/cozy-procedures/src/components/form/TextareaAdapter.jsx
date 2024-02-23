import PropTypes from 'prop-types'
import React from 'react'

import { Textarea } from 'cozy-ui/transpiled/react'

import getInputProps from './getInputProps'

const TextareaAdapter = props => (
  <Textarea
    {...getInputProps(props)}
    onChange={e => {
      props.onChange(e.target.value)
    }}
  />
)

TextareaAdapter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default TextareaAdapter
