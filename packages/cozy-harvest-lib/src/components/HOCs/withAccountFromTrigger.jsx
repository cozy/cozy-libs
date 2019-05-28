import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withMutations } from 'cozy-client'

import * as triggers from '../../helpers/triggers'
import accountsMutations from '../../connections/accounts'

export const KonnectorJobPropTypes = {
  /**
   * The trigger to launch, can be create later if we used account form with
   * prepareConnection
   * Not provided here means it doesn't exist yet
   */
  trigger: PropTypes.object
}

export const withAccountFromTrigger = WrappedComponent => {
  class ComponentWithAccount extends Component {
    constructor(props, context) {
      super(props, context)
      this.state = {
        // trigger provided but account must be fetched
        fetchingAccount: !!props.trigger && !props.account,
        account: props.account
      }
    }

    async componentDidMount() {
      if (this.state.fetchingAccount) {
        const { findAccount, trigger } = this.props
        const account = await findAccount(triggers.getAccountId(trigger))
        this.setState({ fetchingAccount: false, account })
      }
    }

    render() {
      return <WrappedComponent {...this.props} {...this.state} />
    }
  }
  ComponentWithAccount.contextTypes = {
    client: PropTypes.object.isRequired
  }
  ComponentWithAccount.propTypes = {
    /**
     * The trigger to launch, can be create later if we used account form with
     * prepareConnection
     * Not provided here means it doesn't exist yet
     */
    trigger: PropTypes.object,
    ...WrappedComponent.propTypes
  }
  return withMutations(accountsMutations)(ComponentWithAccount)
}

export default withAccountFromTrigger
