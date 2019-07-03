import React from 'react'
import PropTypes from 'prop-types'
import { Input, translate } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'

export const InputAdapter = props => (
  <Input
    {...stripInvalidInputProps(props)}
    onChange={e => {
      props.onChange(e.target.value)
    }}
    onBlur={() => {
      document.querySelector('[role="application"] aside').style.display =
        'block'
    }}
    onFocus={() => {
      document.querySelector('[role="application"] aside').style.display =
        'none'
    }}
  />
)

InputAdapter.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default translate()(InputAdapter)
