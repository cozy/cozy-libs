import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'

import { getCreatedByApp } from 'cozy-client/dist/models/utils'
import Card from 'cozy-ui/transpiled/react/Card'
import {
  useCozyDialog,
  DialogCloseButton
} from 'cozy-ui/transpiled/react/CozyDialogs'
import Dialog from 'cozy-ui/transpiled/react/Dialog'
import DialogContent from 'cozy-ui/transpiled/react/DialogContent'
import Divider from 'cozy-ui/transpiled/react/Divider'
import { Tab, Tabs } from 'cozy-ui/transpiled/react/MuiTabs'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { Contracts } from './KonnectorConfiguration/ConfigurationTab/Contracts'
import { getAccountInstitutionLabel } from './KonnectorConfiguration/ConfigurationTab/bankAccountHelpers'
import KonnectorModalHeader from './KonnectorModalHeader'
import withLocales from './hoc/withLocales'
import { intentsApiProptype } from '../helpers/proptypes'

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
const DisconnectedModal = ({
  accounts,
  onClose,
  initialActiveTab,
  intentsApi
}) => {
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

  if (!konnectorRef.current) {
    return null
  }

  return (
    <Dialog aria-label={t('modal.aria-label')} {...dialogProps}>
      <DialogCloseButton onClick={onClose} />
      <KonnectorModalHeader konnector={konnectorRef.current} />
      <Tabs onChange={setActiveTab} value={activeTab}>
        <Tab label={t('modal.tabs.data')} onClick={() => setActiveTab(0)} />
        <Tab
          onClick={() => setActiveTab(1)}
          label={t('modal.tabs.configuration')}
        />
      </Tabs>
      <Divider />

      {activeTab === 0 ? (
        <DialogContent className="u-pb-1-half">
          <Card>{t('disconnectedAccountModal.disconnected-help')}</Card>
        </DialogContent>
      ) : null}
      {activeTab === 1 ? (
        <>
          {accounts.length ? (
            <DialogContent className={isMobile ? 'u-ph-0' : 'u-pt-1-half'}>
              <Contracts
                contracts={accounts}
                konnector={konnectorRef.current}
                intentsApi={intentsApi}
              />
            </DialogContent>
          ) : (
            <DialogContent className="u-pb-1-half">
              {t('contracts.no-contracts')}
            </DialogContent>
          )}
        </>
      ) : null}
    </Dialog>
  )
}

DisconnectedModal.defaultProps = {
  initialActiveTab: 1
}

DisconnectedModal.propTypes = {
  accounts: PropTypes.array.isRequired,
  /** custom intents api. Can have fetchSessionCode, showInAppBrowser, closeInAppBrowser at the moment */
  intentsApi: intentsApiProptype
}

export default withLocales(DisconnectedModal)
