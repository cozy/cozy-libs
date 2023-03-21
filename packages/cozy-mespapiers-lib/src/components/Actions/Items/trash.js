import React from 'react'

import { isReferencedBy } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { CONTACTS_DOCTYPE } from '../../../doctypes'
import withLocales from '../../../locales/withLocales'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'
import DeleteConfirm from '../DeleteConfirm'

export const trash = ({ pushModal, popModal }) => {
  return {
    name: 'trash',
    action: (files, _, isLast) =>
      pushModal(
        <DeleteConfirm
          files={files}
          referenced={isReferencedBy(files, CONTACTS_DOCTYPE)}
          isLast={isLast}
          onClose={popModal}
        />
      ),
    Component: withLocales(({ onClick, className }) => {
      const { t } = useI18n()

      return (
        <ActionMenuItemWrapper
          className={className}
          icon="trash"
          iconProps={{ color: 'var(--errorColor)' }}
          typographyProps={{ color: 'error' }}
          onClick={onClick}
        >
          {t('action.trash')}
        </ActionMenuItemWrapper>
      )
    })
  }
}
