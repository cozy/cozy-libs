import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Infos from 'cozy-ui/transpiled/react/Infos'

import KonnectorUpdateLinker from '../KonnectorUpdateLinker'

/**
 * Warns the user that a new version is available for the given konnector.
 * Offer a button to redirect to an app able to update a konnector
 * (typically the store).
 */
export const KonnectorUpdateInfos = props => {
  const { className, konnector, isBlocking, t } = props
  return (
    <Infos
      actionButton={
        <KonnectorUpdateLinker
          konnector={konnector}
          isBlocking={isBlocking}
          label={t('infos.konnectorUpdate.button.label')}
        />
      }
      className={className}
      isImportant={isBlocking}
      text={
        isBlocking
          ? t('infos.konnectorUpdate.body.blocking')
          : t('infos.konnectorUpdate.body.regular')
      }
      title={t('infos.konnectorUpdate.title')}
    />
  )
}

KonnectorUpdateInfos.propTypes = {
  konnector: PropTypes.object.isRequired,
  className: PropTypes.string,
  isBlocking: PropTypes.bool,
  t: PropTypes.func.isRequired
}

export default React.memo(translate()(KonnectorUpdateInfos))
