import React from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Uppercase, { Text } from 'cozy-ui/transpiled/react/Text'
import * as triggers from '../../helpers/triggers'
import FlowProvider from '../FlowProvider'

export const DumbLaunchTriggerCard = ({ flow, className, f, t, disabled }) => {
  const flowState = flow.getState()
  const launch = flow.launch
  const trigger = flow.trigger
  const running = flowState.running
  const lastSuccessDate = triggers.getLastSuccessDate(trigger)
  return (
    <Card className={className}>
      <div className="u-flex u-flex-column-s">
        <ul className="u-nolist u-m-0 u-mr-1 u-pl-0 u-flex-grow-1">
          <li className="u-mb-half">
            <Uppercase tag="span" className="u-coolGrey u-mr-half u-fz-tiny">
              {t('card.launchTrigger.lastSync.label')}
            </Uppercase>
            <Text className="u-fz-tiny" tag="span">
              {running
                ? t('card.launchTrigger.lastSync.syncing')
                : lastSuccessDate
                ? f(lastSuccessDate, t('card.launchTrigger.lastSync.format'))
                : t('card.launchTrigger.lastSync.unknown')}
            </Text>
          </li>
          <li className="u-mb-half">
            <Uppercase className="u-coolGrey u-mr-half u-fz-tiny" tag="span">
              {t('card.launchTrigger.frequency.label')}
            </Uppercase>
            <Text className="u-fz-tiny" tag="span">
              {t(
                `card.launchTrigger.frequency.${triggers.getFrequency(
                  trigger
                ) || 'undefined'}`
              )}
            </Text>
          </li>
        </ul>
        <div>
          {/* TODO: Extract this directly in Cozy-UI
            (either with an utility class or a Button prop) */}
          <Button
            label={t('card.launchTrigger.button.label')}
            icon={<Icon focusable="false" icon="sync" spin={running} />}
            className="u-mh-0 u-mv-0"
            disabled={running || disabled}
            onClick={() => launch(trigger)}
            subtle
            style={{ lineHeight: '1.4' }}
          />
        </div>
      </div>
    </Card>
  )
}

/**
 * Shows the state of the trigger and provides the ability to
 * relaunch a trigger
 *
 * - Will follow the connection flow and re-render in case of change
 */
const LaunchTriggerCard = props => {
  if (props.flow) {
    return <DumbLaunchTriggerCard {...props} />
  }

  const normalizedProps = { ...props }
  if (props.initialTrigger) {
    // eslint-disable-next-line no-console
    console.warn(
      'props.initialTrigger is deprecated for LaunchTriggerCard, please use flowProps={{ initialTrigger: {...} }} instead.'
    )
    normalizedProps.flowProps = { initialTrigger: props.initialTrigger }
  }
  return (
    <FlowProvider {...normalizedProps.flowProps}>
      {({ flow }) => {
        return <DumbLaunchTriggerCard {...props} flow={flow} />
      }}
    </FlowProvider>
  )
}

LaunchTriggerCard.propTypes = {
  ...Card.propTypes,

  /** @type {Object} A ConnectionFlow instance */
  flow: PropTypes.object,

  /** @type {Object} ConnectionFlow options (used if props.flow is not provided) */
  flowProps: PropTypes.object,

  /**
   * Disables the "run trigger" button
   */
  disabled: PropTypes.bool
}

export default translate()(LaunchTriggerCard)
