import React, { PureComponent } from 'react'
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

  handleSubmit(e) {
    // prevent refreshing the page when submitting
    // (happens not systematically)
    e.preventDefault()
    this.props.konnectorJob.sendTwoFACode(this.state.twoFACode)
  }

  fetchIcon() {
    const { client } = this.context
    const { konnectorJob } = this.props
    return client.stackClient.getIconURL({
      type: 'konnector',
      slug: konnectorJob.getKonnectorSlug()
    })
  }

  render() {
    const { dismissAction, konnectorJob, t, breakpoints = {} } = this.props
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
              {t(`twoFAForm.title.${konnectorJob.getTwoFACodeProvider()}`)}
            </SubTitle>
            <Text>{t('twoFAForm.desc')}</Text>
            <Field
              className="u-mt-0 u-mb-0"
              value={twoFACode}
              onChange={this.handleChange}
              autoComplete="off"
              label={t('twoFAForm.code.label')}
              size="medium"
              error={konnectorJob.isTwoFARetry()}
              fullwidth
            />
            {konnectorJob.isTwoFARetry() && (
              <Caption className="u-error u-fs-italic u-mt-half">
                {t('twoFAForm.retry')}
              </Caption>
            )}
            <Button
              className="u-mt-1"
              label={t('twoFAForm.CTA')}
              busy={konnectorJob.isTwoFARunning()}
              disabled={konnectorJob.isTwoFARunning() || !twoFACode}
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
