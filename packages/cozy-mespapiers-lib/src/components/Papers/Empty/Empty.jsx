import PropTypes from 'prop-types'
import React from 'react'

import UiEmpty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import EmptyWithKonnector from './EmptyWithKonnector'
import HomeCloud from '../../../assets/icons/HomeCloud.svg'

const Empty = ({ konnector, accountsByFiles }) => {
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
      konnector={konnector}
      accountsByFiles={accountsByFiles}
    />
  )
}

Empty.propTypes = {
  konnector: PropTypes.object,
  accountsByFiles: PropTypes.shape({
    accountsWithFiles: PropTypes.array,
    accountsWithoutFiles: PropTypes.array
  })
}

export default Empty
