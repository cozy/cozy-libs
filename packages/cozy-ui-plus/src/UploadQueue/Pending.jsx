import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

const Pending = translate()(props => (
  <Typography variant="subtitle1" color="primary">
    {props.t('item.pending')}
  </Typography>
))

export default Pending
