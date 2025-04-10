import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'

import { TwakeAssistantIcon } from '../AssistantIcon/TwakeAssistantIcon'

export const AssistantButton = ({ onClick, size }) => {
  return (
    <InputAdornment position="end" className="u-mr-half">
      <IconButton onClick={onClick} size="small" color="primary">
        <Icon icon={TwakeAssistantIcon} size={size === 'medium' ? 24 : 16} />
      </IconButton>
    </InputAdornment>
  )
}
