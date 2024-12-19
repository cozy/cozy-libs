import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import Copy from 'cozy-ui/transpiled/react/Icons/Copy'
import Edit from 'cozy-ui/transpiled/react/Icons/Rename'
import Typography from 'cozy-ui/transpiled/react/Typography'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './styles.styl'
import IntentOpener from '../components/IntentOpener'

const ActionMenuDesktop = forwardRef(
  ({ actions, isEditable, onClose }, ref) => {
    const { t } = useI18n()

    return (
      <ActionMenu
        className={styles['ActionMenuDesktop-ActionMenu']}
        onClose={onClose}
        anchorElRef={ref}
      >
        {isEditable && (
          <IntentOpener
            action="OPEN"
            doctype="io.cozy.files.paper"
            options={{ path: actions.edit.path }}
            onComplete={onClose}
            onDismiss={onClose}
          >
            <ActionMenuItem
              left={<Icon icon={Edit} color="var(--iconTextColor)" />}
            >
              <Typography>
                {t(`Viewer.panel.qualification.actions.edit`)}
              </Typography>
            </ActionMenuItem>
          </IntentOpener>
        )}
        <ActionMenuItem
          onClick={actions.copy.onClick}
          left={<Icon icon={Copy} color="var(--iconTextColor)" />}
        >
          <Typography>
            {t(`Viewer.panel.qualification.actions.copy`)}
          </Typography>
        </ActionMenuItem>
      </ActionMenu>
    )
  }
)

ActionMenuDesktop.displayName = 'ActionMenuDesktop'

ActionMenuDesktop.propTypes = {
  actions: PropTypes.shape({
    copy: PropTypes.object,
    edit: PropTypes.object
  }),
  isEditable: PropTypes.bool,
  onClose: PropTypes.func
}

export default ActionMenuDesktop
