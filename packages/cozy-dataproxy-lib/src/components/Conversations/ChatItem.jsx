import React from 'react'

import Box from 'cozy-ui/transpiled/react/Box'
import Typography from 'cozy-ui/transpiled/react/Typography'

import ChatItemLabel from './ChatItemLabel'

const ChatItem = ({ className, icon, name, label }) => {
  return (
    <>
      <Box
        className={className}
        display="flex"
        alignItems="center"
        gridGap={12}
      >
        {icon}
        <Typography variant="h6" display="inline">
          {name}
        </Typography>
      </Box>
      <Box pl="44px">
        <ChatItemLabel label={label} />
      </Box>
    </>
  )
}

export default ChatItem
