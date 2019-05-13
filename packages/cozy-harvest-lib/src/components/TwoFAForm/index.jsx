import React, { PureComponent } from 'react'
import Modal, { ModalDescription, ModalHeader } from 'cozy-ui/react/Modal'
import Text, { SubTitle, Caption } from 'cozy-ui/react/Text'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'
import Field from 'cozy-ui/react/Field'
import AppIcon from 'cozy-ui/react/AppIcon'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import PropTypes from 'prop-types'

import accounts from '../../helpers/accounts'

export class TwoFAForm extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { twoFACode: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fetchIcon = this.fetchIcon.bind(this)
  }

  handleChange(e) {
    this.setState({ twoFACode: e.currentTarget.value })
  }

  handleSubmit() {
    this.props.handleSubmitTwoFACode(this.state.twoFACode)
  }

  fetchIcon() {
    const { client } = this.context
    const { konnector } = this.props
    return client.stackClient.getIconURL({
      type: 'konnector',
      slug: konnector.slug
    })
  }

  render() {
    const {
      account,
      dismissAction,
      t,
      submitting,
      retryAsked,
      breakpoints = {}
    } = this.props
    const { isMobile } = breakpoints
    const { twoFACode } = this.state

    return (
      <Modal
        dismissAction={dismissAction}
        mobileFullscreen
        containerClassName="u-pos-absolute"
        className={isMobile ? '' : 'u-mt-3'}
        size="xsmall"
      >
        <ModalHeader>
          <AppIcon fetchIcon={this.fetchIcon} className="u-mah-3 u-ml-1" />
        </ModalHeader>
        <ModalDescription>
          <form onSubmit={this.handleSubmit}>
            <SubTitle className="u-mb-1 u-mt-half u-ta-center">
              {t(`twoFAForm.title.${accounts.getTwoFACodeProvider(account)}`)}
            </SubTitle>
            <Text>{t('twoFAForm.desc')}</Text>
            <Field
              className="u-mt-0 u-mb-0"
              value={twoFACode}
              onChange={this.handleChange}
              autoComplete="off"
              label={t('twoFAForm.code.label')}
              size="medium"
              error={retryAsked}
              fullwidth
            />
            {retryAsked && (
              <Caption className="u-error u-fs-italic u-mt-half">
                {t('twoFAForm.retry')}
              </Caption>
            )}
            <Button
              className="u-mt-1"
              label={t('twoFAForm.CTA')}
              busy={submitting}
              disabled={submitting || !twoFACode}
              extension="full"
            />
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

TwoFAForm.contextTypes = {
  client: PropTypes.object
}

export default translate()(withBreakpoints()(TwoFAForm))
