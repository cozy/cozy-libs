import { findPlaceholderByLabelAndCountry } from '../../../helpers/findPlaceholders'

export const makeCountrySearchParam = ({
  papersDefinitions,
  params,
  search
}) => {
  const country = new URLSearchParams(search).get('country')
  const placeholders = findPlaceholderByLabelAndCountry(
    papersDefinitions,
    params.qualificationLabel,
    country
  )
  const placeholder = placeholders?.[0]

  return placeholder?.country ? `country=${placeholder.country}` : ''
}
