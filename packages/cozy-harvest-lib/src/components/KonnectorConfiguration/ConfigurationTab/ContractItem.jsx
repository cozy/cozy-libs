import React, { useState } from 'react'

import startCase from 'lodash/startCase'

import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Icon from 'cozy-ui/transpiled/react/Icon'
import WalletIcon from 'cozy-ui/transpiled/react/Icons/Wallet'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'

import { getPrimaryText, isDisabled } from './helpers'
import EditContract from './EditContract'
import ContractItemSecondaryText from './ContractItemSecondaryText'

const ContractItem = ({ contract, konnector, accountId, divider }) => {
  const [showingEditModal, setShowingEditModal] = useState(false)

  const disabledColorWhenNeeded = isDisabled(contract)
    ? 'var(--disabledTextColor)'
    : 'var(--iconTextColor)'

  return (
    <>
      <ListItem
        button
        divider={divider}
        className="u-c-pointer"
        onClick={() => {
          setShowingEditModal(true)
        }}
      >
        <ListItemIcon>
          <Icon icon={WalletIcon} color={disabledColorWhenNeeded} />
        </ListItemIcon>
        <ListItemText
          primary={
            <span style={{ color: disabledColorWhenNeeded }}>
              {startCase(getPrimaryText(contract).toLowerCase())}
            </span>
          }
          secondary={<ContractItemSecondaryText contract={contract} />}
        />
        <ListItemSecondaryAction>
          <Icon
            icon={RightIcon}
            className="u-mr-1"
            color="var(--secondaryTextColor)"
          />
        </ListItemSecondaryAction>
      </ListItem>
      {showingEditModal && (
        <EditContract
          konnector={konnector}
          accountId={accountId}
          contract={contract}
          onSuccess={() => {
            setShowingEditModal(false)
          }}
          onClose={() => {
            setShowingEditModal(false)
          }}
          onAfterRemove={() => {
            setShowingEditModal(false)
          }}
        />
      )}
    </>
  )
}

export default ContractItem
