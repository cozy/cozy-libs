import compose from 'lodash/flowRight'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import { IllustrationDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Typography from 'cozy-ui/transpiled/react/Typography'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import Field from 'cozy-ui-plus/dist/Field'

import KonnectorIcon from './KonnectorIcon'
import withLocales from './hoc/withLocales'
import accounts, {
  TWOFA_PROVIDERS,
  TWOFA_USER_INPUT
} from '../helpers/accounts'
import { TWO_FA_REQUEST_EVENT, UPDATE_EVENT } from '../models/flowEvents'

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
      isJobRunning: flowState.twoFARunning
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

    if (konnectorPolicy.sendTwoFACode) {
      konnectorPolicy.sendTwoFACode(flow, code)
    } else {
      flow.sendTwoFACode(code)
    }
  }

  render() {
    const { dismissAction, t, flow } = this.props
    const { twoFACode, requestNb, hasErrored, isJobRunning } = this.state

    const account = flow.getAccount()

    const twoFAProvider = accounts.getTwoFACodeProvider(account)
    const needUserInput = TWOFA_USER_INPUT[twoFAProvider]

    const konn = flow.konnector

    return (
      <IllustrationDialog
        onClose={dismissAction}
        size="small"
        open
        title={<KonnectorIcon konnector={konn} className="u-mah-3 u-ml-1" />}
        content={
          <form onSubmit={this.handleSubmit}>
            <Typography variant="h4" className="u-mb-1 u-mt-half u-ta-center">
              {t(`twoFAForm.providers.${twoFAProvider}`)}
            </Typography>

            <Typography variant="body1">
              {twoFAProvider !== TWOFA_PROVIDERS.APP
                ? t(`twoFAForm.desc_${requestNb}`, {
                    _: t(`twoFAForm.desc_1`)
                  })
                : t('twoFAForm.desc-2fa')}
            </Typography>
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
              <Typography
                variant="caption"
                className="u-error u-fs-italic u-mt-half"
              >
                {t('twoFAForm.retry')}
              </Typography>
            )}

            {needUserInput ? (
              <Button
                className="u-mt-1"
                label={t('twoFAForm.CTA')}
                busy={isJobRunning}
                disabled={isJobRunning || !twoFACode}
                onClick={this.handleSubmit}
                fullWidth
              />
            ) : null}
          </form>
        }
      />
    )
  }
}

TwoFAModal.propTypes = {
  flow: PropTypes.object.isRequired
}

export default compose(withLocales, translate(), withBreakpoints())(TwoFAModal)
