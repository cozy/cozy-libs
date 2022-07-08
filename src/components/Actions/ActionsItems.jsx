import React, { useMemo } from 'react'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { getActionName, getOnlyNeededActions } from './utils'

export const ActionsItems = ({ actions, file, onClose }) => {
  const { t } = useI18n()
  const cleanedActions = useMemo(
    () => getOnlyNeededActions(actions, file),
    [actions, file]
  )

  return cleanedActions.map((actionObject, idx) => {
    const actionName = getActionName(actionObject)
    const actionDefinition = Object.values(actionObject)[0]

    const { Component, action, isEnabled } = actionDefinition

    const onClick = () => {
      action && action([file], t)
      onClose()
    }

    return (
      <Component
        key={actionName + idx}
        onClick={onClick}
        isEnabled={isEnabled}
        className={cx('u-flex-items-center')}
        files={file ? [file] : []}
      />
    )
  })
}
