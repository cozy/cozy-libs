import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import { Account } from 'cozy-doctypes'
import { useVaultClient, CozyUtils } from 'cozy-keys-lib'

import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/transpiled/react/palette'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import NavigationList, {
  NavigationListSection,
  NavigationListHeader
} from 'cozy-ui/transpiled/react/NavigationList'
import { ConfirmDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import KeyIcon from 'cozy-ui/transpiled/react/Icons/Key'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import UnlinkIcon from 'cozy-ui/transpiled/react/Icons/Unlink'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'

import TriggerErrorInfo from '../../infos/TriggerErrorInfo'
import { MountPointContext } from '../../MountPointContext'
import { deleteAccount } from '../../../connections/accounts'
import { useTrackPage, useTracker } from '../../hoc/tracking'

import tabSpecs from '../tabSpecs'
import { ContractsForAccount } from './Contracts'

import { KonnectorVaultUnlocker } from '../../TriggerManager'
import { unshareCipher } from '../../../models/cipherUtils'
import { findKonnectorPolicy } from '../../../konnector-policies'

const tabMobileNavListStyle = { borderTop: 'none' }

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  const { t } = useI18n()
  return (
    <ConfirmDialog
      open
      title={t('modal.deleteAccount.title')}
      content={t('modal.deleteAccount.description')}
      onClose={onCancel}
      actions={
        <>
          <Button
            theme="secondary"
            label={t('modal.deleteAccount.cancel')}
            onClick={onCancel}
          />
          <Button
            theme="danger"
            label={t('modal.deleteAccount.confirm')}
            onClick={onConfirm}
          />
        </>
      }
    />
  )
}

const ConfigurationTab = ({
  konnector,
  account,
  addAccount,
  onAccountDeleted,
  showNewAccountButton,
  flow
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { pushHistory } = useContext(MountPointContext)
  const client = useClient()
  const vaultClient = useVaultClient()
  const [deleting, setDeleting] = useState(false)
  const [requestingDeletion, setRequestDeletion] = useState(false)
  const [unlockVault, setUnlockVault] = useState(false)
  const tracker = useTracker()
  const flowState = flow.getState()
  const { error, running } = flowState
  const shouldDisplayError = tabSpecs.configuration.errorShouldBeDisplayed(
    error,
    flowState
  )

  useTrackPage('configuration')

  const hasLoginError = error && error.isLoginError()

  const handleDeleteConfirm = async () => {
    setRequestDeletion(false)
    const extensionInstalled = await CozyUtils.checkHasInstalledExtension(
      client
    )
    const konnectorPolicy = findKonnectorPolicy(konnector)
    if (extensionInstalled && konnectorPolicy.saveInVault) {
      setUnlockVault(true)
    } else {
      await handleDeleteAccount()
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount(client, account)
      onAccountDeleted(account)
      tracker.trackEvent({
        name: 'compte_bancaire_supprime',
        connectorSlug: account.account_type
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDeleteRequest = () => {
    setRequestDeletion(false)
  }

  const handleDeleteRequest = () => {
    setRequestDeletion(true)
  }

  const handleUnlock = async () => {
    await handleDeleteAccount()
    await unshareCipher(vaultClient, account)
    setUnlockVault(false)
  }

  return (
    <div className={isMobile ? '' : 'u-pv-1-half'}>
      {shouldDisplayError && hasLoginError && (
        <TriggerErrorInfo
          className={isMobile ? 'u-mv-2' : 'u-mb-2'}
          error={error}
          konnector={konnector}
        />
      )}
      <NavigationList style={isMobile ? tabMobileNavListStyle : null}>
        <ContractsForAccount konnector={konnector} account={account} />
        <NavigationListHeader>
          {t('modal.updateAccount.general-subheader')}
        </NavigationListHeader>
        <NavigationListSection>
          {konnector.oauth ? null : (
            <ListItem
              button
              divider
              onClick={() => pushHistory(`/accounts/${account._id}/edit`)}
            >
              <ListItemIcon>
                <Icon icon={KeyIcon} color={palette['slateGrey']} />
              </ListItemIcon>
              <ListItemText
                primary={t('modal.updateAccount.identifiers')}
                secondary={Account.getAccountName(account)}
              />
              <ListItemSecondaryAction>
                <div>
                  {running && <Spinner />}
                  <Icon
                    className="u-mr-1"
                    icon={RightIcon}
                    color={palette['coolGrey']}
                  />
                </div>
              </ListItemSecondaryAction>
            </ListItem>
          )}
          <ListItem button onClick={handleDeleteRequest}>
            <ListItemIcon>
              <Icon icon={UnlinkIcon} className="u-error" />
            </ListItemIcon>
            <ListItemText
              primary={
                <span className="u-error">
                  {t('accountForm.disconnect.button')}
                </span>
              }
            />
            <ListItemSecondaryAction>
              {deleting && <Spinner />}
            </ListItemSecondaryAction>
          </ListItem>
          {requestingDeletion ? (
            <ConfirmationDialog
              onCancel={handleCancelDeleteRequest}
              onConfirm={handleDeleteConfirm}
            />
          ) : null}
          {unlockVault ? (
            <KonnectorVaultUnlocker
              konnector={konnector}
              onDismiss={() => setUnlockVault(false)}
              closable={true}
              onUnlock={handleUnlock}
            />
          ) : null}
        </NavigationListSection>
      </NavigationList>
      {showNewAccountButton ? (
        <div className={cx('u-ta-right u-mt-1', isMobile ? 'u-ph-1' : null)}>
          <Button
            extension={isMobile ? 'full' : null}
            onClick={addAccount}
            className="u-ml-0"
            label={t('modal.addAccount.button')}
            theme="ghost"
          />
        </div>
      ) : null}
    </div>
  )
}

ConfigurationTab.propTypes = {
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  error: PropTypes.object,
  addAccount: PropTypes.func.isRequired,
  onAccountDeleted: PropTypes.func.isRequired
}

export default ConfigurationTab
