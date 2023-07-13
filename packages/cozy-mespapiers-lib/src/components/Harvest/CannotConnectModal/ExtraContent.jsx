import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Typography from 'cozy-ui/transpiled/react/Typography'

import withLocales from '../../../locales/withLocales'

const ExtraContent = () => {
  const { t } = useI18n()
  const { qualificationLabel } = useParams()
  const navigate = useNavigate()

  return (
    <>
      <Typography className="u-mb-1">
        {t('Harvest.cannotConnectModal.extraContent')}
      </Typography>
      <Button
        variant="secondary"
        label={t('Harvest.cannotConnectModal.button')}
        onClick={() =>
          navigate(
            `/paper/files/${qualificationLabel}/create/${qualificationLabel}`
          )
        }
        fullWidth
        startIcon={<Icon icon="camera" />}
      />
    </>
  )
}

export default withLocales(ExtraContent)
