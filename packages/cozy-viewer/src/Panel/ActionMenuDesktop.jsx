import PropTypes from 'prop-types'
import React, { forwardRef } from 'react'

import AppLinker from 'cozy-ui/transpiled/react/AppLinker'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Copy from 'cozy-ui/transpiled/react/Icons/Copy'
import Edit from 'cozy-ui/transpiled/react/Icons/Rename'
import Typography from 'cozy-ui/transpiled/react/Typography'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './styles.styl'

const ActionMenuDesktop = forwardRef(
  ({ onClose, isEditable, actions, appLink, appSlug }, ref) => {
    const { handleCopy, handleEdit } = actions
    const { t } = useI18n()

    return (
      <ActionMenu
        className={styles['ActionMenuDesktop-ActionMenu']}
        onClose={onClose}
        anchorElRef={ref}
      >
        {isEditable && (
          <AppLinker app={{ slug: appSlug }} href={appLink}>
            {({ onClick, href }) => {
              return (
                <a href={href} onClick={() => handleEdit(onClick)}>
                  <ActionMenuItem
                    left={<Icon icon={Edit} color="var(--iconTextColor)" />}
                  >
                    <Typography>
                      {t(`Viewer.panel.qualification.actions.edit`)}
                    </Typography>
                  </ActionMenuItem>
                </a>
              )
            }}
          </AppLinker>
        )}
        <ActionMenuItem
          onClick={handleCopy}
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
  onClose: PropTypes.func,
  isEditable: PropTypes.bool,
  actions: PropTypes.shape({
    handleCopy: PropTypes.func,
    handleEdit: PropTypes.func
  }),
  appLink: PropTypes.string,
  appSlug: PropTypes.string
}

export default ActionMenuDesktop
