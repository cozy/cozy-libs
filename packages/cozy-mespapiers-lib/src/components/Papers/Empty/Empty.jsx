import PropTypes from 'prop-types'
import React from 'react'

import UiEmpty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import EmptyWithKonnector from './EmptyWithKonnector'
import HomeCloud from '../../../assets/icons/HomeCloud.svg'

const Empty = ({ konnector, accounts }) => {
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

  return <EmptyWithKonnector konnector={konnector} accounts={accounts} />
}

Empty.propTypes = {
  konnector: PropTypes.object,
  accounts: PropTypes.array
}

export default Empty
