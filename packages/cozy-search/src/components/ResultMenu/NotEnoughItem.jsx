import React from 'react'
import { useI18n } from 'twake-i18n'

import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const NotEnoughItem = () => {
  const { t } = useI18n()

  return (
    <ListItem size="small">
      <ListItemText primary={t('assistant.search.notEnough')} />
    </ListItem>
  )
}

export default NotEnoughItem
