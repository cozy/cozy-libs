import React from 'react'

import { withMutations } from 'cozy-client'
import { withRouter } from 'react-router'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Infos from 'cozy-ui/transpiled/react/Infos'
import Button from 'cozy-ui/transpiled/react/Button'

import accountMutations from '../connections/accounts'
import triggersMutations from '../connections/triggers'
import * as triggersModel from '../helpers/triggers'
import KonnectorModalHeader from './KonnectorModalHeader'

class KonnectorAccounts extends React.Component {
  state = {
    fetchingAccounts: false,
    error: null,
    accounts: []
  }

  /**
   * TODO We should not fetchAccounts and fetchAccount since we already have the informations
   * in the props. We kept this sytem for compatibility on the existing override.
   * Next tasks: remove these methods and rewrite the override
   */
  async componentDidMount() {
    await this.fetchAccounts()
  }

  componentDidUpdate(prevProps) {
    // After leaving the new account screen, we need to refetch accounts in case a new one was created
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      /\/new\/?$/.test(prevProps.location.pathname)
    ) {
      this.fetchAccounts()
    }
  }

  async fetchAccounts() {
    const triggers = this.props.konnector.triggers.data
    const { findAccount } = this.props
    this.setState({ fetchingAccounts: true })
    try {
      const accounts = (await Promise.all(
        triggers.map(async trigger => {
          return {
            account: await findAccount(triggersModel.getAccountId(trigger)),
            trigger
          }
        })
      )).filter(({ account }) => !!account)
      this.setState({ accounts, fetchingAccounts: false, error: null })
    } catch (error) {
      this.setState({ error, fetchingAccounts: false })
    }
  }
  renderError() {
    const { t } = this.props

    return (
      <ModalContent>
        <Infos
          actionButton={
            <Button
              theme="danger"
              onClick={this.fetchAccounts.bind(this)}
              label={t('modal.accounts.error.retry')}
            />
          }
          title={t('modal.accounts.error.title')}
          text={t('modal.accounts.error.description')}
          icon="warning"
          isImportant
        />
      </ModalContent>
    )
  }
  renderLoading() {
    return (
      <ModalContent>
        <div className="u-pv-2 u-ta-center">
          <Spinner size="xxlarge" />
        </div>
      </ModalContent>
    )
  }
  render() {
    // TODO error
    const { accounts, fetchingAccounts, error } = this.state
    const { konnector } = this.props
    return (
      <>
        <KonnectorModalHeader konnector={konnector} />
        {error && this.renderError()}
        {fetchingAccounts && this.renderLoading()}
        {!error && !fetchingAccounts && this.props.children(accounts)}
      </>
    )
  }
}

export default withMutations(accountMutations, triggersMutations)(
  withRouter(translate()(KonnectorAccounts))
)
