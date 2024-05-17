import propType from 'prop-types'
import React from 'react'

import { getEmojiByCountry } from 'cozy-client/dist/models/country/countries'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import Typography from 'cozy-ui/transpiled/react/Typography'

export const CountryRadio = ({ onClick, option, value }) => {
  const isChecked = optionValue => {
    return optionValue === value
  }

  const flagEmoji = getEmojiByCountry(option.value)

  return (
    <ListItem button onClick={onClick} gutters="disabled">
      <Typography variant="h3">{flagEmoji}</Typography>
      <ListItemText primary={<div value={option.value}>{option.label}</div>} />
      <Radio
        inputProps={{ 'aria-label': option.label }}
        value={option.value}
        checked={isChecked(option.value)}
      />
    </ListItem>
  )
}

CountryRadio.propTypes = {
  onClick: propType.func,
  option: propType.shape({
    label: propType.string,
    value: propType.string
  }),
  value: propType.string
}
