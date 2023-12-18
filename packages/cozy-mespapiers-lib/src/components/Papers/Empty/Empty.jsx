import PropTypes from 'prop-types'
import React from 'react'

import UiEmpty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import EmptyWithKonnectors from './EmptyWithKonnectors'
import HomeCloud from '../../../assets/icons/HomeCloud.svg'

const Empty = ({ konnectors, accountsByFiles, hasFiles }) => {
  const { t } = useI18n()
  if (!konnectors || konnectors.length === 0) {
    return (
      <UiEmpty
        className="u-ph-1"
        icon={HomeCloud}
        iconSize="large"
        title={t('Home.Empty.title')}
        text={t('Home.Empty.text')}
      />
    )
  }

  return (
    <EmptyWithKonnectors
      hasFiles={hasFiles}
      konnectors={konnectors}
      accountsByFiles={accountsByFiles}
    />
  )
}

Empty.propTypes = {
  konnectors: PropTypes.array.isRequired,
  hasFiles: PropTypes.bool,
  accountsByFiles: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  })
}

export default Empty
