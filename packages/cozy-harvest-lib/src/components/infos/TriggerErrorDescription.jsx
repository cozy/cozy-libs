import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

import useSupportMail from '../hooks/useSupportMail'
import { getErrorLocale } from '../../helpers/konnectors'
import withKonnectorLocales from '../hoc/withKonnectorLocales'
import Markdown from '../Markdown'

const TriggerErrorDescription = ({ error, konnector, t }) => {
  const client = useClient()
  const { fetchStatus, supportMail } = useSupportMail(client)

  if (fetchStatus !== 'loaded' || !supportMail) {
    return null
  }

  return (
    <Typography variant="body1" component="div">
      <Markdown
        source={getErrorLocale(error, konnector, t, 'description', supportMail)}
      />
    </Typography>
  )
}

TriggerErrorDescription.propTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(withKonnectorLocales(TriggerErrorDescription))
