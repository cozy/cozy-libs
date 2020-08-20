import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import memoize from 'lodash/memoize'

import { Account } from 'cozy-doctypes'
import Button from 'cozy-ui/transpiled/react/Button'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import palette from 'cozy-ui/transpiled/react/palette'
import Icon from 'cozy-ui/transpiled/react/Icon'
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
import DeleteAccountButton from '../../DeleteAccountButton'
import { MountPointContext } from '../../MountPointContext'
import tabSpecs from '../tabSpecs'
import Contracts from './Contracts'

import { useI18n } from 'cozy-ui/transpiled/react'

const contractRx = /io\.cozy\.[a-z]+\.accounts/

const getContractDoctypeFromKonnector = memoize(konnector => {
  const contractPermission = Object.values(konnector.permissions).find(
    permission => permission.type.match(contractRx)
  )
  return contractPermission && contractPermission.type
})

const ConfigurationTab = ({
  konnector,
  account,
  addAccount,
  onAccountDeleted,
  flow
}) => {
  const { t } = useI18n()
  const { pushHistory } = useContext(MountPointContext)
  const flowState = flow.getState()
  const { error, running } = flowState
  const shouldDisplayError = tabSpecs.configuration.errorShouldBeDisplayed(
    error,
    flowState
  )
  const hasLoginError = error && error.isLoginError()

  const contractDoctype = getContractDoctypeFromKonnector(konnector)
  return (
    <ModalContent className={'u-p-0'}>
      <Stack spacing="m">
        {shouldDisplayError && hasLoginError && (
          <TriggerErrorInfo
            className="u-mb-2"
            error={error}
            konnector={konnector}
          />
        )}
        {!konnector.oauth ? (
          <div>
            <ListSubheader>{t('modal.updateAccount.title')}</ListSubheader>
            <List dense className="u-pt-0">
              <ListItem
                className="u-mt-half u-c-pointer"
                onClick={() => pushHistory(`/accounts/${account._id}/edit`)}
              >
                <ListItemIcon>
                  <Icon icon="lock" color={palette['coolGrey']} />
                </ListItemIcon>
                <ListItemText
                  primaryText={konnector.name}
                  secondaryText={Account.getAccountName(account)}
                />
                <ListItemSecondaryAction>
                  {running && <Spinner />}
                </ListItemSecondaryAction>
                <ListItemSecondaryAction>
                  <Icon
                    className="u-mr-1"
                    icon="right"
                    color={palette['coolGrey']}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        ) : null}
        {flag('harvest.show-contracts') && contractDoctype ? (
          <Contracts
            doctype={contractDoctype}
            konnector={konnector}
            account={account}
          />
        ) : null}
        <div className="u-flex u-flex-row">
          <DeleteAccountButton
            account={account}
            disabled={running}
            onSuccess={onAccountDeleted}
          />
          <Button
            onClick={addAccount}
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
