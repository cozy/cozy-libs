import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types'
import React from 'react'
import { Outlet } from 'react-router-dom'

import { useQuery, isQueryLoading } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import AccountModalHeader from './AccountModalHeader'
import Error from './Error'
import { getMatchingTrigger } from './helpers'
import { buildAccountQueryById } from '../../connections/accounts'
import {
  innerAccountModalOverridesProptype,
  intentsApiProptype
} from '../../helpers/proptypes'
import { withMountPointProps } from '../MountPointContext'

const AccountModalWithoutTabs = ({
  accountsAndTriggers,
  konnector,
  accountId,
  intentsApi,
  innerAccountModalOverrides
}) => {
  const matchingTrigger = getMatchingTrigger(accountsAndTriggers, accountId)
  const matchingAccountId = matchingTrigger ? accountId : undefined

  const { definition, options } = buildAccountQueryById(matchingAccountId)
  const { data: accounts, ...accountQueryResult } = useQuery(
    definition,
    options
  )

  const isLoading =
    isQueryLoading(accountQueryResult) || accountQueryResult.hasMore

  const isError =
    !isLoading && (!matchingTrigger || !accounts || accounts?.length === 0)

  const account = accounts?.[0]

  return (
    <>
      <AccountModalHeader
        konnector={konnector}
        account={account}
        accountsAndTriggers={accountsAndTriggers}
      />
      {(isError || isLoading) && (
        <DialogContent className="u-pb-2">
          {isError && (
            <Error
              accountId={accountId}
              accountsAndTriggers={accountsAndTriggers}
              trigger={matchingTrigger}
              lastError={accountQueryResult.lastError}
            />
          )}
          {isLoading && (
            <Spinner className="u-flex u-flex-justify-center" size="xxlarge" />
          )}
        </DialogContent>
      )}
      {!isError && !isLoading && (
        <Outlet
          context={{
            trigger: matchingTrigger,
            account,
            konnector,
            intentsApi,
            innerAccountModalOverrides
          }}
        />
      )}
    </>
  )
}

AccountModalWithoutTabs.propTypes = {
  konnector: PropTypes.object.isRequired,
  /**
   * @type {{ account: 'io.cozy.accounts', trigger: 'io.cozy.triggers' }[]} - An array of objects containing an account and its associated trigger
   */
  accountsAndTriggers: PropTypes.arrayOf(
    PropTypes.shape({
      account: PropTypes.object.isRequired,
      trigger: PropTypes.object.isRequired
    })
  ).isRequired,
  accountId: PropTypes.string.isRequired,
  intentsApi: intentsApiProptype,
  innerAccountModalOverrides: innerAccountModalOverridesProptype
}

export default withMountPointProps(AccountModalWithoutTabs)
