import startCase from 'lodash/startCase'
import React, { useState } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'
import WalletIcon from 'cozy-ui/transpiled/react/Icons/Wallet'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/ListItemSecondaryAction'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import ContractItemSecondaryText from './ContractItemSecondaryText'
import EditContract from './EditContract'
import { getPrimaryText, isDisabled } from './helpers'

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
