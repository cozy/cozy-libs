import React, { Component } from 'react'

import { translate } from 'cozy-ui/react/I18n'
import { SubTitle } from 'cozy-ui/react/Text'

import TriggerManager from '../TriggerManager'
import withKonnectorJob from '../HOCs/withKonnectorJob'

export class Content extends Component {
  render() {
    const {
      konnector,
      konnectorJob,
      onLoginSuccess,
      onSuccess,
      running,
      trigger,
      t
    } = this.props
    return (
      <div>
        <SubTitle className="u-ta-center">
          {t('modal.title', { name: konnector.name })}
        </SubTitle>
        <TriggerManager
          konnector={konnector}
          konnectorJob={konnectorJob}
          trigger={trigger}
          running={running}
          onLoginSuccess={onLoginSuccess}
          onSuccess={onSuccess}
        />
      </div>
    )
  }
}

export default translate()(withKonnectorJob(Content))
