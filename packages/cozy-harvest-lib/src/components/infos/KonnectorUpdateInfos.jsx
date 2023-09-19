import PropTypes from 'prop-types'
import React from 'react'

import Typography from 'cozy-ui/transpiled/react/Typography'
import Infos from 'cozy-ui/transpiled/react/deprecated/Infos'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import KonnectorUpdateLinker from '../KonnectorUpdateLinker'

/**
 * Warns the user that a new version is available for the given konnector.
 * Offer a button to redirect to an app able to update a konnector
 * (typically the store).
 */
const KonnectorUpdateInfos = props => {
  const { t } = useI18n()
  const { className, konnector, isBlocking } = props
  return (
    <Infos
      className={className}
      theme={isBlocking ? 'danger' : 'secondary'}
      description={
        <>
          <Typography className={isBlocking ? 'u-error' : ''} variant="h5">
            {t('infos.konnectorUpdate.title')}
          </Typography>
          <Typography variant="body1">
            {isBlocking
              ? t('infos.konnectorUpdate.body.blocking')
              : t('infos.konnectorUpdate.body.regular')}
          </Typography>
        </>
      }
      action={
        <KonnectorUpdateLinker
          konnector={konnector}
          isBlocking={isBlocking}
          label={t('infos.konnectorUpdate.button.label')}
        />
      }
    />
  )
}

KonnectorUpdateInfos.propTypes = {
  konnector: PropTypes.object.isRequired,
  className: PropTypes.string,
  isBlocking: PropTypes.bool
}

export default React.memo(KonnectorUpdateInfos)
