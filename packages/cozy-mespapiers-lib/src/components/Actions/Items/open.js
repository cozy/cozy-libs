import React from 'react'
import { useNavigate } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const open = () => {
  return {
    name: 'open',
    Component: function Open({ className, files }) {
      const { t } = useI18n()
      const navigate = useNavigate()
      const fileId = files[0]?._id
      const fileTheme = files[0]?.metadata?.qualification?.label

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
    }
  }
}
