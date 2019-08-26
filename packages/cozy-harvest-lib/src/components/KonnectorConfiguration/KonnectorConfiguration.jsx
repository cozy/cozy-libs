import React from 'react'
import PropTypes from 'prop-types'

import {
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel
} from 'cozy-ui/transpiled/react/Tabs'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Card from 'cozy-ui/transpiled/react/Card'
import { Uppercase } from 'cozy-ui/transpiled/react/Text'
import Button from 'cozy-ui/transpiled/react/Button'
import palette from 'cozy-ui/transpiled/react/palette'
import { withRouter } from 'react-router-dom'

import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import LaunchTriggerCard from '../cards/LaunchTriggerCard'
import DeleteAccountButton from '../DeleteAccountButton'
import withLocales from '../hoc/withLocales'
import * as triggersModel from '../../helpers/triggers'
import { Account } from 'cozy-doctypes'

class KonnectorConfiguration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isJobRunning: false,
      konnectorJobError: triggersModel.getError(props.trigger)
    }
  }

  componentDidUpdate(prevProps) {
    const newKonnectorJobError = triggersModel.getError(this.props.trigger)
    const currentKonnectorJobError = this.state.konnectorJobError

    if (
      prevProps.trigger !== this.props.trigger &&
      newKonnectorJobError !== currentKonnectorJobError
    ) {
      this.setState({
        konnectorJobError: newKonnectorJobError
      })
    }
  }

  render() {
    const {
      konnector,
      trigger,
      account,
      onAccountDeleted,
      addAccount,
      history,
      t
    } = this.props
    const { isJobRunning, konnectorJobError } = this.state

    const shouldDisplayError = !isJobRunning && konnectorJobError
    const hasLoginError = konnectorJobError && konnectorJobError.isLoginError()
    const hasErrorExceptLogin = konnectorJobError && !hasLoginError

    return (
      <Tabs initialActiveTab={hasLoginError ? 'configuration' : 'data'}>
        <TabList>
          <Tab name="data">
            {t('modal.tabs.data')}
            {hasErrorExceptLogin && (
              <Icon icon="warning" size={13} className="u-ml-half" />
            )}
          </Tab>
          <Tab name="configuration">
            {t('modal.tabs.configuration')}
            {hasLoginError && (
              <Icon icon="warning" size={13} className="u-ml-half" />
            )}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel name="data" className="u-pt-1-half u-pb-0">
            {shouldDisplayError && hasErrorExceptLogin && (
              <TriggerErrorInfo
                className="u-mb-2"
                error={konnectorJobError}
                konnector={konnector}
              />
            )}
            <LaunchTriggerCard
              trigger={trigger}
              onLaunch={this.handleTriggerLaunch}
              onSuccess={this.handleKonnectorJobSuccess}
              onError={this.handleKonnectorJobError}
              submitting={isJobRunning}
            />
          </TabPanel>
          <TabPanel name="configuration" className="u-pt-1-half u-pb-0">
            {shouldDisplayError && hasLoginError && (
              <TriggerErrorInfo
                className="u-mb-2"
                error={konnectorJobError}
                konnector={konnector}
              />
            )}
            <div className="u-mb-1">
              <Uppercase className="u-mb-half u-slateGrey u-fz-xsmall">
                {t('modal.updateAccount.title')}
              </Uppercase>
              <Card
                className="u-flex u-flex-items-center u-c-pointer"
                onClick={() => history.push('./edit')}
              >
                <div className="u-w-2 u-mr-1">
                  <Icon icon="lock" color={palette['coolGrey']} size={36} />
                </div>
                <div className="u-flex-grow-1">
                  {konnector.name}
                  <div className="u-coolGrey u-fz-tiny">
                    {Account.getAccountName(account)}
                  </div>
                </div>
                <Icon icon="right" color={palette['coolGrey']} />
              </Card>
            </div>
            <div>
              <DeleteAccountButton
                account={account}
                disabled={isJobRunning}
                onSuccess={onAccountDeleted}
              />
              <Button
                onClick={addAccount}
                label={t('modal.addAccount.button')}
                theme="ghost"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  }
}

KonnectorConfiguration.propTypes = {
  konnector: PropTypes.object.isRequired,
  konnectorJobError: PropTypes.object,
  trigger: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default withLocales(withRouter(KonnectorConfiguration))
