import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { withMutations } from 'cozy-client'
import Modal, { ModalDescription, ModalHeader } from 'cozy-ui/react/Modal'
import Text, { SubTitle, Caption } from 'cozy-ui/react/Text'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'
import Field from 'cozy-ui/react/Field'
import AppIcon from 'cozy-ui/react/AppIcon'

import accounts from '../../helpers/accounts'
import accountsMutations from '../../connections/accounts'

const IDLE = 'IDLE'
const ERRORED = 'ERRORED'
const SUBMITTING = 'SUBMITTING'

export class TwoFAModal extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { status: IDLE, twoFACode: '' }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fetchIcon = this.fetchIcon.bind(this)
  }

  componentDidUpdate() {
    const { hasError } = this.props
    if (hasError) {
      this.setState({
        status: ERRORED
      })
    }
  }

  handleChange(e) {
    this.setState({ twoFACode: e.currentTarget.value })
  }

  async handleSubmit(event) {
    event.preventDefault()

    this.setState({
      status: SUBMITTING
    })

    const { onSubmit } = this.props
    const { twoFACode } = this.state

    onSubmit(twoFACode)
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
    const { account, dismissAction, hasError, t } = this.props
    const { status, twoFACode } = this.state
    const submitting = status === SUBMITTING

    return (
      <Modal
        dismissAction={dismissAction}
        mobileFullscreen
        closable
        containerClassName="u-pos-absolute"
        className="u-mt-3"
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
            <Text>
              {t(`twoFAForm.desc.${accounts.getTwoFACodeProvider(account)}`)}
            </Text>
            <Field
              className="u-mt-0 u-mb-0"
              value={twoFACode}
              onChange={this.handleChange}
              autoComplete="off"
              label={t('twoFAForm.code.label')}
              size="medium"
              error={hasError}
              fullwidth
            />
            {hasError && (
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

TwoFAModal.contextTypes = {
  client: PropTypes.object
}

export default translate()(withMutations(accountsMutations)(TwoFAModal))
