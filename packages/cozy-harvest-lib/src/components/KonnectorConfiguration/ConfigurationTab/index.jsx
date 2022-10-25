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
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { useVaultUnlockContext } from 'cozy-keys-lib'

import { deleteAccount } from '../../../connections/accounts'
import { unshareCipher } from '../../../models/cipherUtils'
import { findKonnectorPolicy } from '../../../konnector-policies'

import useSafeState from '../../useSafeState'
import { MountPointContext } from '../../MountPointContext'
import { useTrackPage, useTracker } from '../../hoc/tracking'

import { ContractsForAccount } from './Contracts'
import {
  intentsApiProptype,
  innerAccountModalOverridesProptype
} from '../../../helpers/proptypes'

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
  flow,
  intentsApi,
  innerAccountModalOverrides
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { replaceHistory } = useContext(MountPointContext)
  const client = useClient()
  const vaultClient = useVaultClient()
  const [deleting, setDeleting] = useSafeState(false)
  const [requestingDeletion, setRequestDeletion] = useState(false)
  const tracker = useTracker()
  const { running } = flow.getState()
  const { showUnlockForm } = useVaultUnlockContext()

  useTrackPage('configuration')

  const handleDeleteConfirm = async () => {
    setRequestDeletion(false)
    const konnectorPolicy = findKonnectorPolicy(konnector)
    if (konnectorPolicy.saveInVault) {
      showUnlockForm({
        closable: true,
        onUnlock: handleUnlockForDeletion,
        addCheckShouldUnlock: () => CozyUtils.checkHasInstalledExtension(client)
      })
    } else {
      await handleDeleteAccount()
    }
  }

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      onAccountDeleted(account)
      await deleteAccount(client, account)
      Alerter.success(t('modal.updateAccount.delete-account-success'))
      tracker.trackEvent({
        name: 'compte_bancaire_supprime',
        connectorSlug: account.account_type
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Error while deleting account', error)
      Alerter.error(t('modal.updateAccount.delete-account-error'))
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

  const handleUnlockForDeletion = async () => {
    await handleDeleteAccount()
    await unshareCipher(vaultClient, account)
  }

  const konnectorPolicy = findKonnectorPolicy(konnector)

  return (
    <div className={isMobile ? '' : 'u-pt-1 u-pb-1-half'}>
      {/**
       * Use an extra div with padding instead of setting margins on TriggerErrorInfo since
       * the offsetHeight of the parent does not take into account margins; slide content was
       * cropped since SwipeableViews uses the offsetHeight of the first slide children when
       * computing the height of the slide wrapper.
       */}
      <NavigationList style={isMobile ? tabMobileNavListStyle : null}>
        <NavigationListHeader>
          {t('modal.updateAccount.general-subheader')}
        </NavigationListHeader>
        <NavigationListSection>
          {konnector.oauth || konnectorPolicy.isBIWebView ? null : (
            <ListItem
              button
              divider
              onClick={() => replaceHistory(`/accounts/${account._id}/edit`)}
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
                  {innerAccountModalOverrides?.deleteAccountLabel
                    ? innerAccountModalOverrides.deleteAccountLabel
                    : t('accountForm.disconnect.button')}
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
        </NavigationListSection>

        <ContractsForAccount
          konnector={konnector}
          account={account}
          intentsApi={intentsApi}
          innerAccountModalOverrides={innerAccountModalOverrides}
          onAccountDeleted={onAccountDeleted}
        />
      </NavigationList>
      {showNewAccountButton ? (
        <div
          className={cx('u-ta-right u-mt-1', isMobile ? 'u-ph-1 u-pb-1' : null)}
        >
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
  flow: PropTypes.object,
  addAccount: PropTypes.func.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

export default ConfigurationTab
