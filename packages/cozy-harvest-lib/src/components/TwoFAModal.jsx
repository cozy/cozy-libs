import React, { PureComponent } from 'react'

import { withClient } from 'cozy-client'
import Modal, {
  ModalDescription,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import Text, { SubTitle, Caption } from 'cozy-ui/transpiled/react/Text'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Field from 'cozy-ui/transpiled/react/Field'
import AppIcon from 'cozy-ui/transpiled/react/AppIcon'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import PropTypes from 'prop-types'

export class TwoFAModal extends PureComponent {
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

  handleSubmit(e) {
    // prevent refreshing the page when submitting
    // (happens not systematically)
    e.preventDefault()
    this.props.onTwoFACodeSubmit(this.state.twoFACode)
  }

  fetchIcon() {
    const { client } = this.context
    const { konnectorSlug } = this.props
    return client.stackClient.getIconURL({
      type: 'konnector',
      slug: konnectorSlug
    })
  }

  render() {
    const {
      dismissAction,
      hasFailed,
      isSubmitting,
      provider,
      t,
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
              {t(`twoFAForm.providers.${provider}`)}
            </SubTitle>
            <Text>{t('twoFAForm.desc')}</Text>
            <Field
              className="u-mt-0 u-mb-0"
              value={twoFACode}
              onChange={this.handleChange}
              autoComplete="off"
              label={t('twoFAForm.code.label')}
              size="medium"
              error={hasFailed}
              fullwidth
            />
            {hasFailed && (
              <Caption className="u-error u-fs-italic u-mt-half">
                {t('twoFAForm.retry')}
              </Caption>
            )}
            <Button
              className="u-mt-1"
              label={t('twoFAForm.CTA')}
              busy={isSubmitting}
              disabled={isSubmitting || !twoFACode}
              extension="full"
            />
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

TwoFAModal.propTypes = {
  client: PropTypes.object,
  konnectorSlug: PropTypes.string.isRequired,
  hasFailed: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  onTwoFACodeSubmit: PropTypes.func.isRequired,
  provider: PropTypes.oneOf(['default', 'sms', 'email']).isRequired
}

export default withClient(translate()(withBreakpoints()(TwoFAModal)))
