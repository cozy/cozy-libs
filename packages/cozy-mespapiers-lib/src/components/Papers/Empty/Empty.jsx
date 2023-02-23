import React from 'react'
import PropTypes from 'prop-types'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import UiEmpty from 'cozy-ui/transpiled/react/Empty'

import HomeCloud from '../../../assets/icons/HomeCloud.svg'
import EmptyWithConnector from './EmptyWithConnector'

const Empty = ({ connector, accounts }) => {
  const { t } = useI18n()

  if (!connector) {
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

  return <EmptyWithConnector connector={connector} accounts={accounts} />
}

Empty.propTypes = {
  connector: PropTypes.object,
  accounts: PropTypes.array
}

export default Empty
