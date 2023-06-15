import React, { forwardRef } from 'react'

import { isReferencedBy } from 'cozy-client'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'

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
