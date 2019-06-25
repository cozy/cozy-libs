import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Uppercase, Text } from 'cozy-ui/transpiled/react/Text'

import * as triggers from '../../helpers/triggers'
import TriggerLauncher from '../TriggerLauncher'

export class LaunchTriggerCard extends PureComponent {
  render() {
    const { className, f, trigger, t, ...rest } = this.props
    return (
      <Card className={className} {...rest}>
        <TriggerLauncher trigger={trigger}>
          {({ error, launch, running, trigger }) => {
            const lastSuccessDate = triggers.getLastSuccessDate(trigger)
            return (
              <div className="u-flex u-flex-column-s">
                <ul className="u-nolist u-m-0 u-mr-1 u-pl-0 u-flex-grow-1">
                  <li className="u-mb-1">
                    <Uppercase
                      tag="span"
                      className="u-coolGrey u-mr-half u-fz-tiny"
                    >
                      {t('card.launchTrigger.lastSync.label')}
                    </Uppercase>
                    <Text className="u-fz-tiny" tag="span">
                      {running
                        ? t('card.launchTrigger.lastSync.syncing')
                        : lastSuccessDate
                        ? f(
                            lastSuccessDate,
                            t('card.launchTrigger.lastSync.format')
                          )
                        : t('card.launchTrigger.lastSync.unknown')}
                    </Text>
                  </li>
                  <li className="u-mb-1">
                    <Uppercase
                      className="u-coolGrey u-mr-half u-fz-tiny"
                      tag="span"
                    >
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
                  {error && (
                    <Text className="u-error u-mb-1">
                      {t('card.launchTrigger.error')}
                    </Text>
                  )}
                  <Button
                    label={t('card.launchTrigger.button.label')}
                    icon={<Icon focusable="false" icon="sync" spin={running} />}
                    className="u-mh-0 u-mv-0"
                    disabled={running}
                    onClick={launch}
                    subtle
                    style="line-height:1.4"
                  />
                </div>
              </div>
            )
          }}
        </TriggerLauncher>
      </Card>
    )
  }
}

LaunchTriggerCard.propTypes = {
  ...Card.propTypes,
  trigger: PropTypes.object.isRequired,
  f: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(LaunchTriggerCard)
