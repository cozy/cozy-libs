import React from 'react'
import PropTypes from 'prop-types'
import { Input } from 'cozy-ui/transpiled/react'

import stripInvalidInputProps from './stripInvalidInputProps'
import withLocales from '../../withLocales'

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

export default withLocales(InputAdapter)
