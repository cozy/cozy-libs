// @ts-check
import React from 'react'

import {
  MaxAccountsByKonnectorPaywall,
  MaxAccountsPaywall
} from 'cozy-ui/transpiled/react/Paywall'

import { computeMaxAccountsByKonnector, computeMaxAccounts } from './helpers'

/**
 *
 * @param {Object} props
 * @param {string} props.reason
 * @param {import('cozy-client/types/types').IOCozyKonnector} props.konnector
 * @param {Function} props.onClose
 */
const AccountsPaywall = ({ reason, konnector, onClose }) => {
  if (reason === 'max_accounts_by_konnector') {
    const max = computeMaxAccountsByKonnector(konnector.slug)
    return (
      <MaxAccountsByKonnectorPaywall
        max={max}
        konnectorName={konnector.name}
        onClose={onClose}
      />
    )
  } else if (reason === 'max_accounts') {
    const max = computeMaxAccounts()
    return <MaxAccountsPaywall max={max} onClose={onClose} />
  }
}

export default AccountsPaywall
