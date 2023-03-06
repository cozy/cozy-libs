import PropTypes from 'prop-types'
import React from 'react'

import { useQuery, isQueryLoading, hasQueryBeenLoaded } from 'cozy-client'

import CategoryItemByKonnector from './CategoryItemByKonnector'
import { queryAccounts } from '../../helpers/queries'

const KonnectorsCategories = ({ konnectors, onClick }) => {
  const { data: accounts, ...accountsQueryLeft } = useQuery(
    queryAccounts.definition,
    queryAccounts.options
  )
  const isLoading =
    isQueryLoading(accountsQueryLeft) && !hasQueryBeenLoaded(accountsQueryLeft)

  if (isLoading) return null

  const konnectorsWithAccounts = konnectors.filter(({ konnector }) =>
    accounts.some(account => account.account_type === konnector.slug)
  )

  return konnectorsWithAccounts.map(
    ({ konnectorQualifLabelsWithoutFile }, index) =>
      konnectorQualifLabelsWithoutFile?.map(qualificationLabel => {
        return (
          <CategoryItemByKonnector
            key={`${index} - ${qualificationLabel}`}
            qualificationLabel={qualificationLabel}
            isLast={index === konnectorsWithAccounts.length - 1}
            onClick={onClick}
          />
        )
      })
  )
}

KonnectorsCategories.propTypes = {
  konnectors: PropTypes.arrayOf(PropTypes.object),
  onClick: PropTypes.func
}

export default KonnectorsCategories
