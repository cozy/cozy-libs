/* This code is copy/pasted from Drive */
import React, { useMemo } from 'react'
import cx from 'classnames'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

export const getActionName = actionObject => {
  return Object.keys(actionObject)[0]
}

// We need to clean Actions since action has a displayable
// conditions and we can't know from the begining what the
// behavior will be. For instance, we can't know that
// hr will be the latest action in the sharing views for a
// folder.
// Or we can't know that we'll have two following hr if the
// display condition for the actions between are true or false
export const getOnlyNeededActions = (actions, file) => {
  let previousAction = ''
  const displayableActions = actions.filter(actionObject => {
    const actionDefinition = Object.values(actionObject)[0]

    return (
      !actionDefinition.displayCondition ||
      actionDefinition.displayCondition([file])
    )
  })

  return (
    displayableActions
      .map(actionObject => {
        const actionName = getActionName(actionObject)

        if (previousAction === actionName) {
          previousAction = actionName
          return null
        } else {
          previousAction = actionName
        }

        return actionObject
      })
      .filter(Boolean)
      // We don't want to have an hr as the latest actions available
      .filter((cleanedAction, idx, cleanedActions) => {
        return !(
          getActionName(cleanedAction) === 'hr' &&
          idx === cleanedActions.length - 1
        )
      })
  )
}

/**
 *
 * ActionsItems only shows `actions` that are  suitable for the given
 * `file`.
 */
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
