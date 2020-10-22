import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import { Account } from 'cozy-doctypes'
import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/transpiled/react/palette'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import NavigationList, {
  NavigationListSection,
  NavigationListHeader
} from 'cozy-ui/transpiled/react/NavigationList'
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogCloseButton
} from 'cozy-ui/transpiled/react/Dialog'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import flag from 'cozy-flags'

import TriggerErrorInfo from '../../infos/TriggerErrorInfo'
import { MountPointContext } from '../../MountPointContext'
import { deleteAccount } from '../../../connections/accounts'
import { useTrackPage } from '../../hoc/tracking'

import tabSpecs from '../tabSpecs'
import { ContractsForAccount } from './Contracts'

const tabMobileNavListStyle = { borderTop: 'none' }

const ConfirmationDialog = ({ onConfirm, onCancel }) => {
  const { t } = useI18n()
  return (
    <Dialog maxWidth="xs" fullScreen={false}>
      <DialogCloseButton onClick={onCancel} />
      <DialogTitle>{t('modal.deleteAccount.title')}</DialogTitle>
      <DialogContent>{t('modal.deleteAccount.description')}</DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
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
  const [deleting, setDeleting] = useState(false)
  const [requestingDeletion, setRequestDeletion] = useState(false)
  const flowState = flow.getState()
  const { error, running } = flowState
  const shouldDisplayError = tabSpecs.configuration.errorShouldBeDisplayed(
    error,
    flowState
  )

  useTrackPage('configuration')

  const hasLoginError = error && error.isLoginError()

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount(client, account)
      onAccountDeleted(account)
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

  return (
    <ModalContent className={cx('u-ph-0', isMobile ? 'u-pt-0' : 'u-pt-1-half')}>
      <>
        {shouldDisplayError && hasLoginError && (
          <TriggerErrorInfo
            className={isMobile ? 'u-mv-2' : 'u-mb-2'}
            error={error}
            konnector={konnector}
          />
        )}
        <NavigationList style={isMobile ? tabMobileNavListStyle : null}>
          {flag('harvest.show-contracts') ? (
            <ContractsForAccount konnector={konnector} account={account} />
          ) : null}
          <NavigationListHeader>
            {t('modal.updateAccount.general-subheader')}
          </NavigationListHeader>
          <NavigationListSection>
            {konnector.oauth ? null : (
              <ListItem
                className="u-c-pointer"
                onClick={() => pushHistory(`/accounts/${account._id}/edit`)}
              >
                <ListItemIcon>
                  <Icon icon="key" color={palette['slateGrey']} />
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
                      icon="right"
                      color={palette['coolGrey']}
                    />
                  </div>
                </ListItemSecondaryAction>
              </ListItem>
            )}
            <ListItem className="u-c-pointer" onClick={handleDeleteRequest}>
              <ListItemIcon>
                <Icon icon="unlink" className="u-error" />
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
                onConfirm={handleDeleteAccount}
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
      </>
    </ModalContent>
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
