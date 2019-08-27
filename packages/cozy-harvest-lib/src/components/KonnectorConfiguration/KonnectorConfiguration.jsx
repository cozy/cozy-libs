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
import { SubTitle, Text } from 'cozy-ui/transpiled/react/Text'
import Button from 'cozy-ui/transpiled/react/Button'

import KonnectorUpdateInfos from '../infos/KonnectorUpdateInfos'
import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import TriggerManager from '../TriggerManager'
import LaunchTriggerCard from '../cards/LaunchTriggerCard'
import DeleteAccountButton from '../DeleteAccountButton'
import withLocales from '../hoc/withLocales'
import * as triggersModel from '../../helpers/triggers'
import * as konnectorsModel from '../../helpers/konnectors'

class KonnectorConfiguration extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isJobRunning: false,
      konnectorJobError: triggersModel.getError(props.trigger)
    }

    this.handleKonnectorJobError = this.handleKonnectorJobError.bind(this)
    this.handleKonnectorJobSuccess = this.handleKonnectorJobSuccess.bind(this)
    this.handleTriggerLaunch = this.handleTriggerLaunch.bind(this)
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

  handleTriggerLaunch() {
    this.setState({ isJobRunning: true, konnectorJobError: null })
  }

  handleKonnectorJobSuccess() {
    this.setState({ isJobRunning: false })
    this.props.refetchTrigger()
  }

  handleKonnectorJobError(konnectorJobError) {
    this.setState({
      konnectorJobError,
      isJobRunning: false
    })

    this.props.refetchTrigger()
  }

  render() {
    const {
      konnector,
      trigger,
      account,
      onAccountDeleted,
      addAccount,
      t
    } = this.props
    const { isJobRunning, konnectorJobError } = this.state

    const hasError = !!konnectorJobError
    const shouldDisplayError = !isJobRunning && konnectorJobError
    const hasLoginError = hasError && konnectorJobError.isLoginError()
    const hasTermsVersionMismatchError =
      hasError && konnectorJobError.isTermsVersionMismatchError()

    const isTermsVersionMismatchErrorWithVersionAvailable =
      hasTermsVersionMismatchError &&
      konnectorsModel.hasNewVersionAvailable(konnector)

    const hasGenericError =
      hasError &&
      !hasLoginError &&
      !isTermsVersionMismatchErrorWithVersionAvailable

    return (
      <Tabs initialActiveTab={hasLoginError ? 'configuration' : 'data'}>
        <TabList>
          <Tab name="data">
            {t('modal.tabs.data')}
            {// Login error should not be mentionned in data tab
            hasError && !hasLoginError && (
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
            {konnectorsModel.hasNewVersionAvailable(konnector) && (
              <KonnectorUpdateInfos
                className="u-mb-2"
                konnector={konnector}
                isBlocking={hasTermsVersionMismatchError}
              />
            )}
            {shouldDisplayError && hasGenericError && (
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
              <SubTitle className="u-mb-half">
                {t('modal.updateAccount.title')}
              </SubTitle>
              <TriggerManager
                account={account}
                konnector={konnector}
                initialTrigger={trigger}
                onLaunch={this.handleTriggerLaunch}
                onSuccess={this.handleKonnectorJobSuccess}
                onError={this.handleKonnectorJobError}
                running={isJobRunning}
                showError={false}
              />
            </div>
            <div className="u-mb-2">
              <SubTitle className="u-mb-half">
                {t('modal.deleteAccount.title')}
              </SubTitle>
              <Text className="u-mb-1">
                {t('modal.deleteAccount.description')}
              </Text>
              <DeleteAccountButton
                account={account}
                disabled={isJobRunning}
                onSuccess={onAccountDeleted}
                extension="full"
              />
            </div>
            <div>
              <SubTitle className="u-mb-half">
                {t('modal.addAccount.title')}
              </SubTitle>
              <Button
                onClick={addAccount}
                label={t('modal.addAccount.button')}
                extension="full"
                theme="secondary"
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
  refetchTrigger: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default withLocales(KonnectorConfiguration)
