import React from 'react'
import PropTypes from 'prop-types'
import DialogContent from '@material-ui/core/DialogContent'

import { useQuery, isQueryLoading } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import { buildAccountQueryById } from '../../../connections/accounts'
import { withMountPointProps } from '../../MountPointContext'
import { getMatchingTrigger } from '../helpers'
import AccountModalHeader from '../AccountModalHeader'
import Error from '../Error'
import {
  innerAccountModalOverridesProptype,
  intentsApiProptype
} from '../../../helpers/proptypes'

const AccountModalWithoutTabs = ({
  accountsAndTriggers,
  konnector,
  accountId,
  intentsApi,
  innerAccountModalOverrides,
  children
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
      {!isError &&
        !isLoading &&
        React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                trigger: matchingTrigger,
                account,
                konnector,
                intentsApi,
                innerAccountModalOverrides
              })
            : null
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
