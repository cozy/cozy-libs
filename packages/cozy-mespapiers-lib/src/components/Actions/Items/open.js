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
            navigate({
              pathname: `/paper/file/${fileTheme}/${fileId}`
            })
          }
        >
          {t('action.open')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
