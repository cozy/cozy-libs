import React from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'

import flag from 'cozy-flags'

import { ViewerModal } from '../../datacards/ViewerModal'
import AccountModal from '../AccountModal'
import NewAccountModal from '../NewAccountModal'
import EditAccountModal from '../EditAccountModal'
import KonnectorSuccess from '../KonnectorSuccess'
import HarvestModalRoot from '../HarvestModalRoot'

const HarvestParamsWrapper = props => {
  const params = useParams()
  return props.children(params)
}

const RoutesV6 = ({
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
                showNewAccountButton={!konnectorWithTriggers.clientSide}
                showAccountSelection={!konnectorWithTriggers.clientSide}
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
      {!flag('harvest.inappconnectors.enabled') && (
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
      )}

      <Route
        path="viewer/:accountId/:folderToSaveId/:fileIndex"
        element={routeComponentProps => (
          <ViewerModal {...routeComponentProps} />
        )}
      />

      {/* Redirections */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default RoutesV6
