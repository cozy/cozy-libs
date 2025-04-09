import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import InputAdornment from 'cozy-ui/transpiled/react/InputAdornment'
import { useCozyTheme } from 'cozy-ui/transpiled/react/providers/CozyTheme'

import { TwakeAssistantIcon } from '../AssistantIcon/TwakeAssistantIcon'

export const AssistantButton = ({ onClick, size }) => {
  const { type } = useCozyTheme()

  return (
    <InputAdornment position="end" className="u-mr-half">
      <IconButton onClick={onClick} size="small">
        <Icon
          color={type === 'light' ? 'var(--primaryColor)' : 'var(--white)'}
          icon={TwakeAssistantIcon}
          size={size === 'medium' ? 24 : 16}
        />
      </IconButton>
    </InputAdornment>
  )
}
