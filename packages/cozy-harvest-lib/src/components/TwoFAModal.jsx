import React, { Component } from 'react'
import Modal, { ModalDescription, ModalHeader } from 'cozy-ui/react/Modal'
import Text, { SubTitle, Caption } from 'cozy-ui/react/Text'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'
import Field from 'cozy-ui/react/Field'
import AppIcon from 'cozy-ui/react/AppIcon'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'
import PropTypes from 'prop-types'

import {
  ERROR_EVENT,
  SUCCESS_EVENT,
  LOGIN_SUCCESS_EVENT,
  TWO_FA_MISMATCH_EVENT
} from '../models/KonnectorJob'

export class TwoFAModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      twoFACode: '',
      isRunning: false,
      isTwoFARetry: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fetchIcon = this.fetchIcon.bind(this)
    this.handleEnding = this.handleEnding.bind(this)
    this.handleTwoFARetry = this.handleTwoFARetry.bind(this)
  }

  componentDidMount() {
    const { konnectorJob } = this.props
    konnectorJob.on(ERROR_EVENT, this.handleEnding)
    konnectorJob.on(SUCCESS_EVENT, this.handleEnding)
    konnectorJob.on(LOGIN_SUCCESS_EVENT, this.handleEnding)
    konnectorJob.on(TWO_FA_MISMATCH_EVENT, this.handleEnding)
    konnectorJob.on(TWO_FA_MISMATCH_EVENT, this.handleTwoFARetry)
  }

  handleTwoFARetry() {
    this.setState({ isTwoFARetry: true })
  }

  handleEnding() {
    this.setState({ isRunning: false })
  }

  handleChange(e) {
    this.setState({ twoFACode: e.currentTarget.value })
  }

  handleSubmit(e) {
    // prevent refreshing the page when submitting
    // (happens not systematically)
    e.preventDefault()
    this.setState({ isRunning: true, isTwoFARetry: false })
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
    const { twoFACode, isRunning, isTwoFARetry } = this.state

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
              error={isTwoFARetry}
              fullwidth
            />
            {isTwoFARetry && (
              <Caption className="u-error u-fs-italic u-mt-half">
                {t('twoFAForm.retry')}
              </Caption>
            )}
            <Button
              className="u-mt-1"
              label={t('twoFAForm.CTA')}
              busy={isRunning}
              disabled={isRunning || !twoFACode}
              extension="full"
            />
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

TwoFAModal.contextTypes = {
  client: PropTypes.object
}

export default translate()(withBreakpoints()(TwoFAModal))
