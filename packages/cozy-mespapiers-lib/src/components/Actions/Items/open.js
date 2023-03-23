import React from 'react'
import { useNavigate } from 'react-router-dom'

import ActionMenuItemWrapper from 'cozy-ui/transpiled/react/ActionMenu/ActionMenuItemWrapper'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import withLocales from '../../../locales/withLocales'

export const open = () => {
  return {
    name: 'open',
    Component: withLocales(({ className, docs }) => {
      const { t } = useI18n()
      const navigate = useNavigate()
      const fileId = docs[0]?._id
      const fileTheme = docs[0]?.metadata?.qualification?.label

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="openwith"
          onClick={() =>
            // The path is absolute because this link can be present on the route "/", which does not have "fileTheme".
            navigate({
              pathname: `/paper/files/${fileTheme}/${fileId}`
            })
          }
        >
          {t('action.open')}
        </ActionMenuItemWrapper>
      )
    })
  }
}
