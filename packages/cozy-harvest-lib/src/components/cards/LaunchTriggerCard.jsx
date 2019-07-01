import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import pick from 'lodash/pick'

import Button from 'cozy-ui/transpiled/react/Button'
import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Uppercase, Text } from 'cozy-ui/transpiled/react/Text'

import * as triggers from '../../helpers/triggers'
import TriggerLauncher, {
  TriggerLauncher as DumbTriggerLauncher
} from '../TriggerLauncher'

export class LaunchTriggerCard extends PureComponent {
  render() {
    const { className, f, t } = this.props
    return (
      <Card className={className}>
        <TriggerLauncher
          {...pick(this.props, Object.keys(DumbTriggerLauncher.propTypes))}
        >
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
                    // TODO: Extract this directly in Cozy-UI
                    // (either with an utility class or a Button prop)
                    style={{ lineHeight: '1.4' }}
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
  ...TriggerLauncher.propTypes,
  f: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(LaunchTriggerCard)
