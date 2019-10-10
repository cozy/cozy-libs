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
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Stack from 'cozy-ui/transpiled/react/Stack'
import palette from 'cozy-ui/transpiled/react/palette'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { withRouter } from 'react-router'
import { Account } from 'cozy-doctypes'
import get from 'lodash/get'

import KonnectorUpdateInfos from '../infos/KonnectorUpdateInfos'
import * as konnectorsModel from '../../helpers/konnectors'

import TriggerErrorInfo from '../infos/TriggerErrorInfo'
import LaunchTriggerCard from '../cards/LaunchTriggerCard'
import DocumentsLinkCard from '../cards/DocumentsLinkCard'
import DeleteAccountButton from '../DeleteAccountButton'
import TriggerLauncher from '../TriggerLauncher'

class KonnectorAccountTabs extends React.Component {
  render() {
    const {
      konnector,
      trigger: initialTrigger,
      account,
      onAccountDeleted,
      //TODO on``
      addAccount,
      history,
      t
    } = this.props

    return (
      <TriggerLauncher initialTrigger={initialTrigger}>
        {({ error, running }) => {
          const hasError = error
          const shouldDisplayError = !running && error
          const hasLoginError = hasError && error.isLoginError()
          const hasTermsVersionMismatchError =
            hasError && error.isTermsVersionMismatchError()

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
                  {shouldDisplayError && hasLoginError && (
                    <Icon icon="warning" size={13} className="u-ml-half" />
                  )}
                </Tab>
              </TabList>

              <TabPanels>
                <TabPanel name="data" className="u-pt-1-half u-pb-0">
                  <Stack>
                    {konnectorsModel.hasNewVersionAvailable(konnector) && (
                      <KonnectorUpdateInfos
                        konnector={konnector}
                        isBlocking={hasTermsVersionMismatchError}
                      />
                    )}
                    {shouldDisplayError && hasGenericError && (
                      <TriggerErrorInfo error={error} konnector={konnector} />
                    )}
                    <LaunchTriggerCard initialTrigger={initialTrigger} />
                    <DocumentsLinkCard
                      folderId={get(initialTrigger, 'message.folder_to_save')}
                    />
                  </Stack>
                </TabPanel>
                <TabPanel name="configuration" className="u-pt-1-half u-pb-0">
                  {shouldDisplayError && hasLoginError && (
                    <TriggerErrorInfo
                      className="u-mb-2"
                      error={error}
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
                        <Icon
                          icon="lock"
                          color={palette['coolGrey']}
                          size={36}
                        />
                      </div>
                      <div className="u-flex-grow-1">
                        {konnector.name}
                        <div className="u-coolGrey u-fz-tiny">
                          {Account.getAccountName(account)}
                        </div>
                      </div>
                      <div>{running && <Spinner />}</div>
                      <Icon icon="right" color={palette['coolGrey']} />
                    </Card>
                  </div>
                  <div>
                    <DeleteAccountButton
                      account={account}
                      disabled={running}
                      onSuccess={onAccountDeleted}
                    />
                    {/*TODO Create a CreateAccountButton */}
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
        }}
      </TriggerLauncher>
    )
  }
}

KonnectorAccountTabs.propTypes = {
  konnector: PropTypes.object.isRequired,
  trigger: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  addAccount: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

export default translate()(withRouter(KonnectorAccountTabs))
