import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import GearIcon from 'cozy-ui/transpiled/react/Icons/Gear'

import { useFlowState } from '../../models/withConnectionFlow'
import withAdaptiveRouter from '../hoc/withRouter'

const LaunchTriggerAlertMenu = ({
  flow,
  t,
  disabled,
  konnectorRoot,
  historyAction
}) => {
  const { running } = useFlowState(flow)
  const { launch } = flow

  const anchorRef = useRef()
  const [showOptions, setShowOptions] = useState(false)

  return (
    <>
      <IconButton ref={anchorRef} onClick={() => setShowOptions(true)}>
        <Icon icon={DotsIcon} />
      </IconButton>
      {showOptions && (
        <ActionMenu
          anchorElRef={anchorRef}
          autoclose={true}
          onClose={() => setShowOptions(false)}
        >
          {!running && !disabled && (
            <ActionMenuItem
              left={<Icon icon={SyncIcon} />}
              onClick={() => {
                launch({ autoSuccessTimer: false })
                setShowOptions(false)
              }}
            >
              {t('card.launchTrigger.button.label')}
            </ActionMenuItem>
          )}
          <ActionMenuItem
            left={<Icon icon={GearIcon} />}
            onClick={() => historyAction(`${konnectorRoot}/config`, 'push')}
          >
            {t('card.launchTrigger.configure')}
          </ActionMenuItem>
        </ActionMenu>
      )}
    </>
  )
}

LaunchTriggerAlertMenu.defaultProps = {
  konnectorRoot: ''
}

LaunchTriggerAlertMenu.propTypes = {
  flow: PropTypes.object,
  t: PropTypes.func,
  disabled: PropTypes.bool,
  konnectorRoot: PropTypes.string,
  historyAction: PropTypes.func
}

export default withAdaptiveRouter(LaunchTriggerAlertMenu)
