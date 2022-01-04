import React from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'
import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Info from 'cozy-ui/transpiled/react/Icons/Info'
import Typography from 'cozy-ui/transpiled/react/Typography'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'

import * as triggers from '../../helpers/triggers'
import { isRunnable } from '../../helpers/konnectors'
import FlowProvider from '../FlowProvider'
import { useFlowState } from '../../models/withConnectionFlow'

const inlineStyle = { display: 'inline-block' }

export var DumbLaunchTriggerCard = ({ flow, className, f, t, disabled }) => {
  const { launch } = flow
  const flowState = useFlowState(flow)
  const { trigger } = flowState
  const { konnector } = flow
  const { running } = flowState
  const lastSuccessDate = triggers.getLastSuccessDate(trigger)
  const isKonnectorRunnable = isRunnable({ win: window, konnector })

  return (
    <Card className={className}>
      <div className="u-flex u-flex-column-s">
        <ul className="u-nolist u-m-0 u-mr-1 u-pl-0 u-flex-grow-1">
          <li className="u-mb-half">
            <Typography
              variant="caption"
              component="span"
              style={inlineStyle}
              className="u-mr-half"
            >
              {t('card.launchTrigger.lastSync.label')}
            </Typography>
            <Typography
              variant="caption"
              color="textPrimary"
              component="span"
              style={inlineStyle}
            >
              {running
                ? t('card.launchTrigger.lastSync.syncing')
                : lastSuccessDate
                ? f(lastSuccessDate, t('card.launchTrigger.lastSync.format'))
                : t('card.launchTrigger.lastSync.unknown')}
            </Typography>
          </li>
          {isKonnectorRunnable ? (
            <li className="u-mb-half">
              <Typography
                variant="caption"
                component="span"
                style={inlineStyle}
                className="u-mr-half"
              >
                {t('card.launchTrigger.frequency.label')}
              </Typography>
              <Typography
                variant="caption"
                color="textPrimary"
                component="span"
                style={inlineStyle}
              >
                {t(
                  `card.launchTrigger.frequency.${
                    triggers.getFrequency(trigger) || 'undefined'
                  }`
                )}
              </Typography>
            </li>
          ) : (
            <Media align="top">
              <Img className="u-m-1">
                <Icon icon={Info} />
              </Img>
              <Bd className="u-m-1">
                <Typography variant="body1">
                  {t('accountForm.notClientSide', { name: konnector.name })}
                </Typography>
              </Bd>
            </Media>
          )}
        </ul>
        {isKonnectorRunnable && (
          <div>
            {/* TODO: Extract this directly in Cozy-UI
            (either with an utility class or a Button prop) */}
            <Button
              label={t('card.launchTrigger.button.label')}
              icon={<Icon focusable="false" icon={SyncIcon} spin={running} />}
              className="u-mh-0 u-mv-0"
              disabled={running || disabled}
              onClick={() => launch({ autoSuccessTimer: false })}
              subtle
              style={{ lineHeight: '1.4' }}
            />
          </div>
        )}
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
      {({ flow }) => <DumbLaunchTriggerCard {...props} flow={flow} />}
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
