import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import memoize from 'lodash/memoize'

import { useClient } from 'cozy-client'
import { Account } from 'cozy-doctypes'
import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/transpiled/react/palette'
import Icon from 'cozy-ui/transpiled/react/Icon'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { ModalContent } from 'cozy-ui/transpiled/react/Modal'
import Stack from 'cozy-ui/transpiled/react/Stack'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import flag from 'cozy-flags'

import TriggerErrorInfo from '../../infos/TriggerErrorInfo'
import { MountPointContext } from '../../MountPointContext'
import { deleteAccount } from '../../../connections/accounts'

import tabSpecs from '../tabSpecs'
import { ContractsForAccount } from './Contracts'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const getContractDoctypeFromKonnector = memoize(konnector => {
  if (konnector.categories.includes('banking')) {
    return 'io.cozy.bank.accounts'
  }
})

const ConfigurationTab = ({
  konnector,
  account,
  addAccount,
  onAccountDeleted,
  showNewAccount,
  flow
}) => {
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()
  const { pushHistory } = useContext(MountPointContext)
  const client = useClient()
  const [deleting, setDeleting] = useState(false)
  const flowState = flow.getState()
  const { error, running } = flowState
  const shouldDisplayError = tabSpecs.configuration.errorShouldBeDisplayed(
    error,
    flowState
  )
  const hasLoginError = error && error.isLoginError()

  const contractDoctype = getContractDoctypeFromKonnector(konnector)

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await deleteAccount(client, account)
      onAccountDeleted(account)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <ModalContent className="u-pt-0 u-ph-0">
      <Stack spacing="m">
        {shouldDisplayError && hasLoginError && (
          <TriggerErrorInfo
            className="u-mb-2"
            error={error}
            konnector={konnector}
          />
        )}
        {flag('harvest.show-contracts') && contractDoctype ? (
          <ContractsForAccount doctype={contractDoctype} account={account} />
        ) : null}
        {!konnector.oauth ? (
          <div>
            <ListSubheader>
              {t('modal.updateAccount.general-subheader')}
            </ListSubheader>
            <List dense className="u-pt-0">
              <ListItem
                className="u-mt-half u-c-pointer"
                onClick={() => pushHistory(`/accounts/${account._id}/edit`)}
              >
                <ListItemIcon>
                  <Icon icon="key" color={palette['slateGrey']} />
                </ListItemIcon>
                <ListItemText
                  primaryText={t('modal.updateAccount.identifiers')}
                  secondaryText={Account.getAccountName(account)}
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
              <ListItem
                className="u-mt-half u-c-pointer"
                onClick={() => handleDeleteAccount(account)}
              >
                <ListItemIcon>
                  <Icon icon="trash" className="u-error" />
                </ListItemIcon>
                <ListItemText
                  className="u-error"
                  primaryText={t('accountForm.disconnect.button')}
                />
                <ListItemSecondaryAction>
                  {deleting && <Spinner />}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        ) : null}
        <div className={cx('u-ta-right', isMobile ? 'u-ph-1' : null)}>
          <Button
            extension={isMobile ? 'full' : null}
            onClick={addAccount}
            className="u-ml-0"
            label={t('modal.addAccount.button')}
            theme="ghost"
          />
        </div>
      </Stack>
    </ModalContent>
  )
}

ConfigurationTab.propTypes = {
  konnector: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  error: PropTypes.object,
  addAccount: PropTypes.func.isRequired,
  onAccountDeleted: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
}

export default ConfigurationTab
