import React from 'react'
import { useI18n } from 'twake-i18n'

import { useClient } from 'cozy-client'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Infos from 'cozy-ui/transpiled/react/deprecated/Infos'

import { loadSelectedAccountId } from '../../helpers/accounts'
import withLocales from '../hoc/withLocales'

const ErrorComponent = ({
  accountId,
  accountsAndTriggers,
  trigger,
  lastError
}) => {
  const { t } = useI18n()
  const client = useClient()

  const error = !trigger ? new Error('No matching trigger found') : lastError

  const handleClick = () => {
    loadSelectedAccountId(client, accountId, accountsAndTriggers)
  }

  return (
    <Infos
      actionButton={
        <Button
          label={t('modal.konnector.error.button')}
          color="error"
          onClick={handleClick}
        />
      }
      title={t('modal.konnector.error.title')}
      text={t('modal.konnector.error.description', error)}
      icon="warning"
      isImportant
    />
  )
}

export default withLocales(ErrorComponent)
