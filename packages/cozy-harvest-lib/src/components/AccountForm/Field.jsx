import React, { useState } from 'react'

import UIField from 'cozy-ui-plus/dist/Field'

const ObfuscateChar = () => {
  return (
    <span style={{ display: 'none' }} aria-hidden="true">
      ·
    </span>
  )
}

/**
 * Obfuscate a given label by inserting chars in it.
 * The chars inserted are not visible, but they are rendered by screen readers,
 * which is no good for accessibility. We must find a better solution.
 */
const ObfuscatedLabel = ({ label }) => {
  const chars = label.split('')

  return chars.map((char, index) => (
    <React.Fragment key={`${char}-${index}`}>
      <ObfuscateChar />
      {char}
      <ObfuscateChar />
    </React.Fragment>
  ))
}

export const Field = ({ label, type, ...props }) => {
  let Component = type === 'password' ? PasswordField : UIField
  return (
    <Component
      {...props}
      label={<ObfuscatedLabel label={label} />}
      labelProps={{
        'aria-label': label
      }}
      type={type}
    />
  )
}

const PasswordField = ({
  secondaryLabels,
  value: valueProps,
  onChange,
  ...props
}) => {
  const [hidden, setHidden] = useState(true)
  const [value, setValue] = useState(valueProps)

  const dot = '\u2022'
  const hiddenValue = value.replace(/./g, dot)

  const getNewValue = inputValue => {
    const valueArray = Array.from(inputValue)

    const newValue = valueArray.reduce((newValue, char, index) => {
      if (char === dot) {
        return newValue + value.charAt(index)
      } else {
        return newValue + char
      }
    }, '')

    return newValue
  }

  const handleChange = e => {
    const newValue = getNewValue(e.target.value)

    onChange({
      target: {
        value: newValue
      }
    })

    setValue(newValue)
  }

  /*
    Using the `new-password` value is the best way to avoid
    autocomplete for password.
    See https://stackoverflow.com/a/17721462/1135990
  */
  return (
    <UIField
      {...props}
      value={hidden ? hiddenValue : value}
      type="text"
      autoComplete="new-password"
      onChange={handleChange}
      side={
        value ? (
          <span onClick={() => setHidden(!hidden)}>
            {hidden ? secondaryLabels.showLabel : secondaryLabels.hideLabel}
          </span>
        ) : null
      }
    />
  )
}
