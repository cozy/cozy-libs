import PropTypes from 'prop-types'
import React from 'react'

import { useQuery, isQueryLoading, hasQueryBeenLoaded } from 'cozy-client'

import CategoryItemByKonnector from './CategoryItemByKonnector'
import { makeQualificationLabelsWithoutFiles } from './helpers'
import { queryAccounts } from '../../helpers/queries'

const KonnectorsCategories = ({ konnectors, selectedTheme, onClick }) => {
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

  const qualificationLabelsWithoutFiles = makeQualificationLabelsWithoutFiles(
    konnectorsWithAccounts,
    selectedTheme
  )

  return qualificationLabelsWithoutFiles.map((qualificationLabel, index) => (
    <CategoryItemByKonnector
      key={`${index} - ${qualificationLabel}`}
      qualificationLabel={qualificationLabel}
      isFirst={index === 0}
      isLast={index === qualificationLabelsWithoutFiles.length - 1}
      onClick={onClick}
    />
  ))
}

KonnectorsCategories.propTypes = {
  konnectors: PropTypes.arrayOf(PropTypes.object),
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func
}

export default KonnectorsCategories
