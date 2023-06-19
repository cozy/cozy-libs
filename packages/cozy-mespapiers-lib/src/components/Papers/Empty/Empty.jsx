import PropTypes from 'prop-types'
import React from 'react'

import UiEmpty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import EmptyWithKonnector from './EmptyWithKonnector'
import HomeCloud from '../../../assets/icons/HomeCloud.svg'

const Empty = ({ konnector, accountsByFiles, hasFiles }) => {
  const { t } = useI18n()

  if (!konnector) {
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
    <EmptyWithKonnector
      hasFiles={hasFiles}
      konnector={konnector}
      accountsByFiles={accountsByFiles}
    />
  )
}

Empty.propTypes = {
  konnector: PropTypes.object,
  hasFiles: PropTypes.bool,
  accountsByFiles: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  })
}

export default Empty
