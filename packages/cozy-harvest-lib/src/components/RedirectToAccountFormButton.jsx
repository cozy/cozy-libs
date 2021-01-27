import React from 'react'
import { withRouter } from 'react-router'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import { getAccountId } from '../helpers/triggers'

const RedirectToAccountFormButton = ({ konnector, trigger, history }) => {
  const { t } = useI18n()
  const accountId = getAccountId(trigger)
  return (
    <Button
      className="u-ml-0"
      theme="secondary"
      label={t('error.reconnect-via-form')}
      onClick={() =>
        history.push(`/connected/${konnector.slug}/accounts/${accountId}/edit`)
      }
    />
  )
}

export default withRouter(RedirectToAccountFormButton)
