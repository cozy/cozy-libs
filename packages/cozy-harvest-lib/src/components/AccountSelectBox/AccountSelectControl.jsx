import React from 'react'
import { Text, Icon } from 'cozy-ui/transpiled/react'
import palette from 'cozy-ui/transpiled/react/palette'

import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'

const AccountSelectControl = ({ name }) => {
  return (
    <Text className="u-slateGrey u-flex u-flex-items-center u-c-pointer">
      <Text className="u-maw-5 u-ellipsis">{name}</Text>
      <Icon
        icon={BottomIcon}
        size="12"
        className="u-ml-half"
        color={palette['coolGrey']}
      />
    </Text>
  )
}

export default AccountSelectControl
