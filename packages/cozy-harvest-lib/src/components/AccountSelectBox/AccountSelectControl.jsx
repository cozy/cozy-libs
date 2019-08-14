import React from 'react'
import { Text, Icon } from 'cozy-ui/transpiled/react'

const AccountSelectControl = ({ name }) => {
  return (
    <Text className="u-slateGrey u-flex u-flex-items-center u-c-pointer">
      {name} <Icon icon={'bottom-select'} size="12" className="u-ml-half" />
    </Text>
  )
}

export default AccountSelectControl
