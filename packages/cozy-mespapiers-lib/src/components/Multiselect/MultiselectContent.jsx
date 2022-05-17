import React from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import MultipapersIcon from '../../assets/icons/Multipapers.svg'
import GhostButton from './GhostButton'

const MultiselectContent = () => {
  const { t } = useI18n()

  return (
    <div className="u-mb-2">
      <Empty
        className="u-ph-1 u-pt-0"
        icon={MultipapersIcon}
        iconSize="medium"
        text={t('Multiselect.empty')}
      />
      <GhostButton label={t('Multiselect.select')} fullWidth />
    </div>
  )
}

export default MultiselectContent
