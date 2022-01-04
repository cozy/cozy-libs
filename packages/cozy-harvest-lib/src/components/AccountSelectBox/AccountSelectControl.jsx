import React from 'react'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'

import Typography from 'cozy-ui/transpiled/react/Typography'

const AccountSelectControl = ({ name }) => (
  <div className="u-flex u-flex-items-center u-c-pointer">
    <Typography className="u-dib u-maw-5 u-ellipsis" variant="body1">
      {name}
    </Typography>
    <Icon
      icon={BottomIcon}
      size="12"
      className="u-ml-half"
      color={palette.coolGrey}
    />
  </div>
)

export default AccountSelectControl
