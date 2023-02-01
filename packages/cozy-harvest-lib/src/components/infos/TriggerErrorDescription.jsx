import React from 'react'
import PropTypes from 'prop-types'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'

import useSupportMail from '../hooks/useSupportMail'
import { getErrorLocale } from '../../helpers/konnectors'
import withKonnectorLocales from '../hoc/withKonnectorLocales'
import Markdown from '../Markdown'

const TriggerErrorDescription = ({ error, konnector, linkProps }) => {
  const { t } = useI18n()
  const client = useClient()
  const { fetchStatus, supportMail } = useSupportMail(client)

  if (fetchStatus !== 'loaded' || !supportMail) {
    return null
  }

  return (
    <Typography variant="body1" component="div">
      <Markdown
        source={getErrorLocale(error, konnector, t, 'description', supportMail)}
        linkProps={linkProps}
      />
    </Typography>
  )
}

TriggerErrorDescription.propTypes = {
  error: PropTypes.object.isRequired,
  konnector: PropTypes.object.isRequired,
  linkProps: PropTypes.object
}

const TriggerErrorDescriptionWrapper = withKonnectorLocales(
  TriggerErrorDescription
)

const TriggerErrorDescriptionWrapperWrapper = ({ children, ...props }) => {
  const { lang } = useI18n()

  return (
    <TriggerErrorDescriptionWrapper lang={lang} {...props}>
      {children}
    </TriggerErrorDescriptionWrapper>
  )
}

export default TriggerErrorDescriptionWrapperWrapper
