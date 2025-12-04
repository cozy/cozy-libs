import React from 'react'
import { useI18n } from 'twake-i18n'

import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const NoResultItem = () => {
  const { t } = useI18n()

  return (
    <ListItem size="small">
      <ListItemText primary={t('assistant.search.noItem')} />
    </ListItem>
  )
}

export default NoResultItem
