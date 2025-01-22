import React from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'

import flag from 'cozy-flags'

import AccountModal from './AccountModal'
import EditAccountModal from './EditAccountModal'
import HarvestModalRoot from './HarvestModalRoot'
import ConfigurationTab from './KonnectorConfiguration/ConfigurationTab'
import DataTab from './KonnectorConfiguration/DataTab'
import KonnectorSuccess from './KonnectorSuccess'
import NewAccountModal from './NewAccountModal'
import { ViewerModal } from '../datacards/ViewerModal'

const HarvestParamsWrapper = props => {
  const params = useParams()
  return props.children(params)
}

const InternalRoutes = ({
  konnectorWithTriggers,
  accountsAndTriggers,
  onSuccess,
  onDismiss
}) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HarvestModalRoot
            accounts={accountsAndTriggers}
            konnector={konnectorWithTriggers}
          />
        }
      />

      <Route
        path="new"
        element={
          <NewAccountModal
            konnector={konnectorWithTriggers}
            onSuccess={onSuccess}
            onDismiss={onDismiss}
          />
        }
      />

      <Route
        path="accounts/:accountId"
        element={
          <HarvestParamsWrapper>
            {params => (
              <AccountModal
                konnector={konnectorWithTriggers}
                accountId={params.accountId}
                accountsAndTriggers={accountsAndTriggers}
                onDismiss={onDismiss}
                showNewAccountButton={
                  !konnectorWithTriggers.clientSide ||
                  flag('clisk.multi-accounts')
                }
                showAccountSelection={
                  !konnectorWithTriggers.clientSide ||
                  flag('clisk.multi-accounts')
                }
                Component={DataTab}
              />
            )}
          </HarvestParamsWrapper>
        }
      />

      <Route
        path="accounts/:accountId/config"
        element={
          <HarvestParamsWrapper>
            {params => (
              <AccountModal
                konnector={konnectorWithTriggers}
                accountId={params.accountId}
                accountsAndTriggers={accountsAndTriggers}
                onDismiss={onDismiss}
                showNewAccountButton={
                  !konnectorWithTriggers.clientSide ||
                  flag('clisk.multi-accounts')
                }
                showAccountSelection={
                  !konnectorWithTriggers.clientSide ||
                  flag('clisk.multi-accounts')
                }
                Component={ConfigurationTab}
              />
            )}
          </HarvestParamsWrapper>
        }
      />

      <Route
        path="accounts/:accountId/edit"
        element={
          <HarvestParamsWrapper>
            {params => (
              <EditAccountModal
                konnector={konnectorWithTriggers}
                accountId={params.accountId}
                accounts={accountsAndTriggers}
              />
            )}
          </HarvestParamsWrapper>
        }
      />

      <Route
        path="accounts/:accountId/success"
        element={
          <HarvestParamsWrapper>
            {params => (
              <KonnectorSuccess
                konnector={konnectorWithTriggers}
                accountId={params.accountId}
                accounts={accountsAndTriggers}
                onDismiss={onDismiss}
              />
            )}
          </HarvestParamsWrapper>
        }
      />

      <Route
        path="viewer/:accountId/:folderToSaveId/:fileIndex"
        element={<ViewerModal />}
      />

      {/* Redirections */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export { InternalRoutes }
