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

import { TWO_FA_MISMATCH_EVENT, STATUS_CHANGE } from '../models/KonnectorJob'

export class TwoFAModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { twoFACode: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleTwoFAMismatch = this.handleTwoFAMismatch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.fetchIcon = this.fetchIcon.bind(this)
  }

  componentDidMount() {
    this.props.konnectorJob
      .on(TWO_FA_MISMATCH_EVENT, this.handleTwoFAMismatch)
      .on(STATUS_CHANGE, this.handleStatusChange)
  }

  handleStatusChange() {
    this.forceUpdate()
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

  handleTwoFAMismatch() {
    // force a re-render to get the updated error and running state from konnectorJob
    this.forceUpdate()
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

    const isJobRunning = konnectorJob.isTwoFARunning()
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
              {t(`twoFAForm.providers.${konnectorJob.getTwoFACodeProvider()}`)}
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
              busy={isJobRunning}
              disabled={isJobRunning || !twoFACode}
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
  konnectorJob: PropTypes.object.isRequired
}

export default withClient(translate()(withBreakpoints()(TwoFAModal)))
