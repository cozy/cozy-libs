import React from 'react'
import { useHistory } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const open = () => {
  return {
    name: 'open',
    Component: function Open({ className, files }) {
      const { t } = useI18n()
      const history = useHistory()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="openwith"
          onClick={() =>
            history.push({
              pathname: `/paper/file/${files[0]._id}`
            })
          }
        >
          {t('action.open')}
        </ActionMenuItemWrapper>
      )
    }
  }
}
