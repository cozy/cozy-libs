import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Buttons'

const MultiselectViewActions = () => {
  const { t } = useI18n()

  return (
    <>
      <Button variant="secondary" label={t('action.download')} />
      <Button variant="secondary" label={t('action.forward')} />
    </>
  )
}

export default MultiselectViewActions
