import React from 'react'
import { translate } from 'twake-i18n'

import Typography from 'cozy-ui/transpiled/react/Typography'

const Pending = translate()(props => (
  <Typography variant="subtitle1" color="primary">
    {props.t('item.pending')}
  </Typography>
))

export default Pending
