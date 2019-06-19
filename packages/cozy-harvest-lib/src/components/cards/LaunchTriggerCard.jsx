import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'
import Card from 'cozy-ui/transpiled/react/Card'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Text } from 'cozy-ui/transpiled/react/Text'

import TriggerLauncher from '../TriggerLauncher'

export class LaunchTriggerCard extends PureComponent {
  render() {
    const { className, trigger, t, ...rest } = this.props
    return (
      <Card className={className} {...rest}>
        <TriggerLauncher trigger={trigger}>
          {({ error, launch, running }) => (
            <div>
              {error && (
                <Text className="u-error">{t('card.launchTrigger.error')}</Text>
              )}
              <Button
                label={t('card.launchTrigger.button.label')}
                icon={<Icon focusable="false" icon="sync" spin={running} />}
                className="u-mv-half u-mh-0"
                disabled={running}
                onClick={launch}
                subtle
              />
            </div>
          )}
        </TriggerLauncher>
      </Card>
    )
  }
}

LaunchTriggerCard.propTypes = {
  ...Card.propTypes,
  trigger: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default translate()(LaunchTriggerCard)
