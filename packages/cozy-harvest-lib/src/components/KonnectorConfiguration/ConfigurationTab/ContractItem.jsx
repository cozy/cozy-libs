import React, { useState } from 'react'

import startCase from 'lodash/startCase'

import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ListItemSecondaryAction from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemSecondaryAction'
import Icon from 'cozy-ui/transpiled/react/Icon'
import WalletIcon from 'cozy-ui/transpiled/react/Icons/Wallet'
import RightIcon from 'cozy-ui/transpiled/react/Icons/Right'

import { getPrimaryTextPerDoctype, getPrimaryTextDefault } from './helpers'
import EditContract from './EditContract'
import SecondaryText from './SecondaryText'

const ContractItem = ({ contract, konnector, accountId, divider }) => {
  const [showingEditModal, setShowingEditModal] = useState(false)
  const getPrimaryText =
    getPrimaryTextPerDoctype[contract._type] || getPrimaryTextDefault
  const isDisabled = Boolean(contract.metadata.disabledAt)

  return (
    <>
      <ListItem
        button
        divider={divider}
        className="u-c-pointer"
        onClick={() => {
          setShowingEditModal(true)
        }}
        disabled={isDisabled}
      >
        <ListItemIcon>
          <Icon icon={WalletIcon} color="var(--iconTextColor)" />
        </ListItemIcon>
        <ListItemText
          primary={startCase(getPrimaryText(contract).toLowerCase())}
          secondary={<SecondaryText contract={contract} />}
        />
        <ListItemSecondaryAction>
          <Icon
            icon={RightIcon}
            className={`u-mr-1 ${isDisabled ? 'u-o-50' : ''}`}
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
