import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import BottomIcon from 'cozy-ui/transpiled/react/Icons/Bottom'
import Typography from 'cozy-ui/transpiled/react/Typography'

const AccountSelectControlBig = ({ name }) => {
  return (
    <div className="u-flex u-flex-items-center u-c-pointer">
      <Typography className="u-dib u-maw-5 u-ellipsis u-lh-1" variant="h3">
        {name}
      </Typography>
      <Icon
        icon={BottomIcon}
        size="15"
        className="u-ml-half"
        color={"var('--primaryTextColor')"}
      />
    </div>
  )
}

const AccountSelectControl = ({ name, variant }) => {
  if (variant === 'big') return <AccountSelectControlBig name={name} />

  return (
    <div className="u-flex u-flex-items-center u-c-pointer">
      <Typography className="u-dib u-maw-5 u-ellipsis" variant="body1">
        {name}
      </Typography>
      <Icon
        icon={BottomIcon}
        size="12"
        className="u-ml-half"
        color="var(--iconTextColor)"
      />
    </div>
  )
}

export default AccountSelectControl
