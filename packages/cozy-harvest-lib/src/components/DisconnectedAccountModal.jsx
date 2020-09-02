import React, { useRef, useState } from 'react'
import { Contracts } from 'cozy-harvest-lib/dist/components/KonnectorConfiguration/ConfigurationTab/Contracts'
import KonnectorModalHeader from 'cozy-harvest-lib/dist/components/KonnectorModalHeader'

import { getCreatedByApp } from 'cozy-client/dist/models/utils'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import Modal, { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Card from 'cozy-ui/transpiled/react/Card'
import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel
} from 'cozy-ui/transpiled/react/Tabs'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import withLocales from './hoc/withLocales'
import { getAccountInstitutionLabel } from './KonnectorConfiguration/ConfigurationTab/bankAccountHelpers'

const createDummyKonnectorFromAccount = account => {
  return {
    name: getAccountInstitutionLabel(account),
    slug: getCreatedByApp(account) || null
  }
}

/**
 * Serves when configuring vendor accounts whose io.cozy.accounts
 * has been deleted.
 *
 * The UI must be as close as possible to the AccountModal but since
 * we lack a lot of data to show an AccountModal (no trigger, no konnector,
 * no account), it was implemented as a separate component.
 */
const DisconnectedModal = ({ accounts, onClose, initialActiveTab }) => {
  const { t } = useI18n()
  // We keep the konnector in a ref so that when we remove all accounts,
  // we still have a konnector to show the icon
  const konnectorRef = useRef()
  if (!konnectorRef.current) {
    konnectorRef.current = createDummyKonnectorFromAccount(accounts[0])
  }
  const { isMobile } = useBreakpoints()

  const [activeTab, setActiveTab] = useState(initialActiveTab)

  return (
    <Modal mobileFullscreen={true} dismissAction={onClose}>
      <KonnectorModalHeader konnector={konnectorRef.current} />
      <ModalContent className={isMobile ? 'u-p-0' : null}>
        <Tabs initialActiveTab={initialActiveTab}>
          <TabList>
            <Tab onClick={() => setActiveTab('data')} name="data">
              {t('modal.tabs.data')}
            </Tab>
            <Tab
              onClick={() => setActiveTab('configuration')}
              name="configuration"
            >
              {t('modal.tabs.configuration')}
            </Tab>
          </TabList>
        </Tabs>
      </ModalContent>
      <TabPanels activeTab={activeTab}>
        <TabPanel name="data" className="u-pt-1">
          <ModalContent>
            <Card>{t('disconnectedAccountModal.disconnected-help')}</Card>
          </ModalContent>
        </TabPanel>
        <TabPanel name="configuration">
          {accounts.length ? (
            <ModalContent className={isMobile ? 'u-p-0' : null}>
              <Contracts contracts={accounts} />
            </ModalContent>
          ) : (
            t('contracts.no-contracts')
          )}
        </TabPanel>
      </TabPanels>
    </Modal>
  )
}

DisconnectedModal.defaultProps = {
  initialActiveTab: 'configuration'
}

export default withLocales(DisconnectedModal)
