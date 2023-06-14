import PropTypes from 'prop-types'
import React from 'react'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import Radio from 'cozy-ui/transpiled/react/Radios'

import { useScannerI18n } from '../../Hooks/useScannerI18n'

const RadioAdapterItem = ({ onClick, option, value }) => {
  const scannerT = useScannerI18n()

  const isChecked = inputValue => {
    return inputValue === value
  }

  return (
    <ListItem button onClick={onClick}>
      <ListItemIcon>
        <Radio
          inputProps={{ 'aria-label': option }}
          value={option}
          checked={isChecked(option)}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <div value={option}>
            {scannerT(`attributes.contractType.${option}`)}
          </div>
        }
        data-testid={`RadioAdapterItem-${option}`}
      />
    </ListItem>
  )
}

RadioAdapterItem.propTypes = {
  onClick: PropTypes.func,
  option: PropTypes.string,
  value: PropTypes.string
}

export default RadioAdapterItem
