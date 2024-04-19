import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { Button } from 'cozy-ui/transpiled/react/Button'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import 'cozy-ui/assets/icons/ui/cloud.svg'
import {
  Wizard,
  WizardLogo,
  WizardWrapper,
  WizardMain,
  WizardFooter,
  WizardTitle,
  WizardDescription
} from 'cozy-ui/transpiled/react/Wizard'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import ButtonLinkRegistration from './ButtonLinkRegistration'

export class Welcome extends Component {
  registerRender = () => {
    const {
      t,
      register,
      allowRegistration,
      breakpoints: { isMobile }
    } = this.props

    if (allowRegistration) {
      return (
        <Button
          theme="secondary"
          onClick={register}
          label={t('mobile.onboarding.welcome.sign_up')}
          size={isMobile ? 'normal' : 'large'}
        />
      )
    }
    return (
      <ButtonLinkRegistration
        label={t('mobile.onboarding.welcome.create_my_cozy')}
        size={isMobile ? 'normal' : 'large'}
      />
    )
  }

  render() {
    const {
      t,
      selectServer,
      breakpoints: { isMobile },
      appIcon,
      appTitle
    } = this.props

    return (
      <Wizard>
        <WizardWrapper align="center">
          <WizardMain>
            <WizardLogo src={appIcon} badgeIcon="cloud" badgeColor="white" />
            <WizardTitle className="u-mt-0">
              {t('mobile.onboarding.welcome.title', { appTitle })}
            </WizardTitle>
            <WizardDescription>
              {t('mobile.onboarding.welcome.desc', { appTitle })}
            </WizardDescription>
          </WizardMain>
          <WizardFooter>
            {this.registerRender()}
            <Button
              onClick={selectServer}
              theme="secondary"
              label={t('mobile.onboarding.welcome.button')}
              size={isMobile ? 'normal' : 'large'}
            />
          </WizardFooter>
        </WizardWrapper>
      </Wizard>
    )
  }
}

Welcome.propTypes = {
  selectServer: PropTypes.func.isRequired,
  appIcon: PropTypes.string.isRequired
}
export default withBreakpoints()(translate()(Welcome))
