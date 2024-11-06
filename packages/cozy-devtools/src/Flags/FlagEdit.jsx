import React, { useEffect, useState } from 'react'

import flag from 'cozy-flags'
import Button from 'cozy-ui/transpiled/react/Buttons'
import TextField from 'cozy-ui/transpiled/react/TextField'

import { isJSONString, makeHumanValue } from './helpers'

const FlagEdit = ({ flag: editedFlag }) => {
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    value: '',
    humanValue: ''
  })

  useEffect(() => {
    if (editedFlag) setFormData(editedFlag)
  }, [editedFlag])

  const handleSubmit = e => {
    e.preventDefault()
    if (!formData.name || !formData.value) return

    /** @type {any} */
    let value = formData.value
    if (isJSONString(value)) {
      value = JSON.parse(value)
    } else if (value === 'true' || value === 'false') {
      value = Boolean(value)
    }

    flag(formData.name, value)
    location.reload()
  }

  const handleFlagNameChange = e => {
    setFormData({
      ...formData,
      key: `flag__${e.target.value}`,
      name: e.target.value
    })
  }

  const handleFlagValueChange = e => {
    let value = e.target.value
    if (Number.isInteger(value)) {
      value = parseInt(value)
    }
    setFormData({
      ...formData,
      value,
      humanValue: makeHumanValue(value)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="u-mt-1 u-flex-items-center u-flex">
      <TextField
        label="Name"
        name="name"
        onChange={handleFlagNameChange}
        value={formData.name}
        size="small"
        variant="outlined"
      />
      <TextField
        label="Value"
        name="value"
        onChange={handleFlagValueChange}
        value={formData.humanValue}
        size="small"
        variant="outlined"
        className="u-ml-1"
      />
      <Button type="submit" label="Edit" className="u-ml-1" />
    </form>
  )
}

export { FlagEdit }
