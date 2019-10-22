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

import { TWO_FA_MISMATCH_EVENT } from '../models/KonnectorJob'

export class TwoFAModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { twoFACode: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleTwoFAMismatch = this.handleTwoFAMismatch.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.konnectorJob.on(TWO_FA_MISMATCH_EVENT, this.handleTwoFAMismatch)
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

  render() {
    const {
      dismissAction,
      konnectorJob,
      t,
      breakpoints = {},
      account
    } = this.props
    const { isMobile } = breakpoints
    const { twoFACode } = this.state

    const twoFAProvider = accounts.getTwoFACodeProvider(account)
    const hasErrored = konnectorJob.isTwoFARetry()

    const needUserInput = TWOFA_USER_INPUT[twoFAProvider]

    const konn = {
      slug: konnectorJob.getKonnectorSlug()
    }

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
              {twoFAProvider === TWOFA_PROVIDERS.APP
                ? t('twoFAForm.desc-2fa')
                : t('twoFAForm.desc')}
            </Text>
            {needUserInput ? (
              <Field
                className="u-mt-0 u-mb-0"
                value={twoFACode}
                onChange={this.handleChange}
                autoComplete="off"
                label={t('twoFAForm.code.label')}
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
                busy={konnectorJob.isTwoFARunning()}
                disabled={konnectorJob.isTwoFARunning() || !twoFACode}
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
  konnectorJob: PropTypes.object.isRequired
}

export default translate()(withBreakpoints()(TwoFAModal))
