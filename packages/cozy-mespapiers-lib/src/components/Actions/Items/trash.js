import React, { forwardRef } from 'react'

import { isReferencedBy } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { CONTACTS_DOCTYPE } from '../../../doctypes'
import withLocales from '../../../locales/withLocales'
import DeleteConfirm from '../DeleteConfirm'

export const trash = ({ pushModal, popModal }) => {
  return {
    name: 'trash',
    action: (doc, { isLast }) =>
      pushModal(
        <DeleteConfirm
          files={[doc]}
          referenced={isReferencedBy(doc, CONTACTS_DOCTYPE)}
          isLast={isLast}
          onClose={popModal}
        />
      ),
    Component: withLocales(
      // eslint-disable-next-line react/display-name
      forwardRef((props, ref) => {
        const { t } = useI18n()

        return (
          <ActionsMenuItem {...props} ref={ref}>
            <ListItemIcon>
              <Icon icon="trash" color="var(--errorColor)" />
            </ListItemIcon>
            <ListItemText
              primary={t('action.trash')}
              primaryTypographyProps={{ color: 'error' }}
            />
          </ActionsMenuItem>
        )
      })
    )
  }
}
