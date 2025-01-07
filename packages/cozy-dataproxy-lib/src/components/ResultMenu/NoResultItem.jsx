import React from 'react'

import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const NoResultItem = () => {
  const { t } = useI18n()

  return (
    <ListItem size="small">
      <ListItemText primary={t('assistant.search.noItem')} />
    </ListItem>
  )
}

export default NoResultItem