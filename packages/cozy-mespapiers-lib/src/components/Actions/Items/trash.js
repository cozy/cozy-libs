import React from 'react'

import { isReferencedBy } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import { CONTACTS_DOCTYPE } from '../../../doctypes'
import DeleteConfirm from '../DeleteConfirm'
import ActionMenuItemWrapper from '../ActionMenuItemWrapper'

export const trash = ({ pushModal, popModal }) => {
  return {
    action: files =>
      pushModal(
        <DeleteConfirm
          files={files}
          referenced={isReferencedBy(files, CONTACTS_DOCTYPE)}
          onClose={popModal}
        />
      ),
    Component: function Trash({ onClick, className }) {
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
    }
  }
}
