import React, { PureComponent } from 'react'

import Modal, {
  ModalDescription,
  ModalHeader
} from 'cozy-ui/transpiled/react/Modal'
import Text, { SubTitle, Caption } from 'cozy-ui/transpiled/react/Text'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Button from 'cozy-ui/transpiled/react/Button'
import Field from 'cozy-ui/transpiled/react/Field'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import PropTypes from 'prop-types'
import KonnectorIcon from './KonnectorIcon'

import accounts, {
  TWOFA_PROVIDERS,
  TWOFA_USER_INPUT
} from '../helpers/accounts'

import { TWO_FA_REQUEST_EVENT, UPDATE_EVENT } from '../models/KonnectorJob'

/**
 * Displayed during connection creation when the konnector detects
 * a two fa request by the vendor.
 */
export class TwoFAModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { twoFACode: '', requestNb: 1 }
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleFlowUpdate = this.handleFlowUpdate.bind(this)
    this.handleTwoFARequest = this.handleTwoFARequest.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const flow = this.props.flow
    flow.on(UPDATE_EVENT, this.handleFlowUpdate)
    flow.on(TWO_FA_REQUEST_EVENT, this.handleTwoFARequest)
  }

  componentWillUnmount() {
    const flow = this.props.flow
    flow.removeListener(UPDATE_EVENT, this.handleFlowUpdate)
    flow.removeListener(TWO_FA_REQUEST_EVENT, this.handleTwoFARequest)
  }

  handleFlowUpdate() {
    const flowState = this.props.flow.getState()
    this.setState({
      hasErrored: flowState.twoFARetry,
      isJobRunning: flowState.twoFARunning || flowState.konnectorRunning
    })
  }

  handleTwoFARequest() {
    // When the konnector ask for a two fa a second time, we need
    // to reset the field
    this.setState({ twoFACode: '', requestNb: this.state.requestNb + 1 })
  }

  handleFieldChange(e) {
    this.setState({ twoFACode: e.currentTarget.value })
  }

  handleSubmit(e) {
    e.preventDefault()

    const { flow } = this.props
    const code = this.state.twoFACode

    const konnectorPolicy = flow.getKonnectorPolicy()
    if (konnectorPolicy.sendAdditionalInformation) {
      const fields = flow.getAdditionalInformationNeeded()
      const firstField = fields[0]
      flow.sendAdditionalInformation({
        [firstField.name]: code
      })
    } else {
      flow.sendTwoFACode(code)
    }
  }

  render() {
    const { dismissAction, t, breakpoints = {}, flow } = this.props
    const { isMobile } = breakpoints
    const { twoFACode, requestNb, hasErrored, isJobRunning } = this.state

    const account = flow.getAccount()

    const twoFAProvider = accounts.getTwoFACodeProvider(account)
    const needUserInput = TWOFA_USER_INPUT[twoFAProvider]

    const konn = flow.konnector

    return (
      <Modal
        dismissAction={dismissAction}
        mobileFullscreen
        containerClassName="u-pos-absolute"
        className={isMobile ? '' : 'u-mt-3'}
        size="xsmall"
        into="body"
      >
        <ModalHeader>
          <KonnectorIcon konnector={konn} className="u-mah-3 u-ml-1" />
        </ModalHeader>
        <ModalDescription>
          <form onSubmit={this.handleSubmit}>
            <SubTitle className="u-mb-1 u-mt-half u-ta-center">
              {t(`twoFAForm.providers.${twoFAProvider}`)}
            </SubTitle>

            <Text>
              {twoFAProvider !== TWOFA_PROVIDERS.APP
                ? t(`twoFAForm.desc_${requestNb}`, {
                    _: t(`twoFAForm.desc_1`)
                  })
                : t('twoFAForm.desc-2fa')}
            </Text>
            {needUserInput ? (
              <Field
                className="u-mt-0 u-mb-0"
                value={twoFACode}
                onChange={this.handleFieldChange}
                autoComplete="off"
                label={
                  t(`twoFAForm.code.label_${requestNb}`, {
                    _: t(`twoFAForm.code.label_1`)
                  }) + (requestNb > 2 ? ` (${requestNb})` : '')
                }
                size="medium"
                error={hasErrored}
                fullwidth
              />
            ) : null}
            {hasErrored && (
              <Caption className="u-error u-fs-italic u-mt-half">
                {t('twoFAForm.retry')}
              </Caption>
            )}

            {needUserInput ? (
              <Button
                className="u-mt-1"
                label={t('twoFAForm.CTA')}
                busy={isJobRunning}
                disabled={isJobRunning || !twoFACode}
                extension="full"
              />
            ) : null}
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

TwoFAModal.propTypes = {
  flow: PropTypes.object.isRequired
}

export default translate()(withBreakpoints()(TwoFAModal))
