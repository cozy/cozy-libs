import React, { Fragment, useState, useEffect } from 'react'

import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import Paper from 'cozy-ui/transpiled/react/Paper'

import RadioAdapterItem from './RadioAdapterItem'
import { defaultProptypes } from './proptypes'

const RadioAdapter = ({
  attrs: { name, options, required },
  idx,
  defaultValue,
  setValidInput,
  setValue
}) => {
  const [currentValue, setCurrentValue] = useState(() => defaultValue || '')

  const handleClick = val => {
    setCurrentValue(val)
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
            <RadioAdapterItem
              option={option}
              onClick={() => handleClick(option)}
              value={currentValue}
            />
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
