import React, { Fragment, useState, useEffect } from 'react'

import Paper from 'cozy-ui/transpiled/react/Paper'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Radio from 'cozy-ui/transpiled/react/Radios'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'

import { useScannerI18n } from '../../Hooks/useScannerI18n'
import { defaultProptypes } from './proptypes'

const RadioAdapter = ({
  attrs: { name, options, required },
  idx,
  defaultValue,
  setValidInput,
  setValue
}) => {
  const scannerT = useScannerI18n()
  const [currentValue, setCurrentValue] = useState(() => defaultValue || '')

  const isChecked = inputValue => {
    return inputValue === currentValue
  }

  const handelClick = event => {
    const value = event.target?.attributes?.value?.value || event.target?.value
    setCurrentValue(value)
  }

  useEffect(() => {
    setValue(prev => ({ ...prev, [name]: currentValue }))
  }, [name, setValue, currentValue])

  useEffect(() => {
    setValidInput(prev => ({
      ...prev,
      [idx]: !required || typeof currentValue !== 'undefined'
    }))
  }, [idx, setValidInput, currentValue, required])

  return (
    <Paper>
      <List>
        {options.map((option, index) => (
          <Fragment key={index}>
            <ListItem button onClick={handelClick}>
              <ListItemIcon>
                <Radio value={option} checked={isChecked(option)} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <div value={option}>
                    {scannerT(`attributes.contractType.${option}`)}
                  </div>
                }
              />
            </ListItem>
            {index !== options.length - 1 && (
              <Divider component="li" variant="inset" />
            )}
          </Fragment>
        ))}
      </List>
    </Paper>
  )
}

RadioAdapter.propTypes = defaultProptypes

export default RadioAdapter
