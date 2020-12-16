import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Contracts } from './KonnectorConfiguration/ConfigurationTab/Contracts'
import KonnectorModalHeader from './KonnectorModalHeader'

import { getCreatedByApp } from 'cozy-client/dist/models/utils'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

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

import Dialog from 'cozy-ui/transpiled/react/Dialog'
import {
  useCozyDialog,
  DialogCloseButton
} from 'cozy-ui/transpiled/react/CozyDialogs'
import DialogContent from '@material-ui/core/DialogContent'

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

  const { dialogProps } = useCozyDialog({ onClose, open: true })
  return (
    <Dialog aria-label={t('modal.aria-label')} {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <KonnectorModalHeader konnector={konnectorRef.current} />
      <DialogContent className={isMobile ? 'u-p-0' : null}>
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
      </DialogContent>
      <TabPanels activeTab={activeTab}>
        <TabPanel name="data" className="u-pt-1">
          <DialogContent>
            <Card>{t('disconnectedAccountModal.disconnected-help')}</Card>
          </DialogContent>
        </TabPanel>
        <TabPanel name="configuration">
          {accounts.length ? (
            <DialogContent className={isMobile ? 'u-ph-0' : 'u-pt-1-half'}>
              <Contracts contracts={accounts} />
            </DialogContent>
          ) : (
            t('contracts.no-contracts')
          )}
        </TabPanel>
      </TabPanels>
    </Dialog>
  )
}

DisconnectedModal.defaultProps = {
  initialActiveTab: 'configuration'
}

DisconnectedModal.propTypes = {
  accounts: PropTypes.array.isRequired
}

export default withLocales(DisconnectedModal)
