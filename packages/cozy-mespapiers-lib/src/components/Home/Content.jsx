import uniqBy from 'lodash/uniqBy'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import ResultForSearch from './ResultForSearch'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import PaperGroup from '../Papers/PaperGroup'

const Content = ({
  contacts,
  papers,
  konnectors,
  selectedTheme,
  searchValue
}) => {
  const { t } = useI18n()

  const papersByCategories = useMemo(
    () => uniqBy(papers, 'metadata.qualification.label'),
    [papers]
  )
  const hasResult = papersByCategories.length > 0
  const isSearching = searchValue.length > 0 || Boolean(selectedTheme)

  if (!hasResult)
    return (
      <Empty
        icon={HomeCloud}
        iconSize="large"
        title={t('Home.Empty.title')}
        text={t('Home.Empty.text')}
        className="u-ph-1"
      />
    )

  if (isSearching)
    return (
      <ResultForSearch
        contacts={contacts}
        papers={papers}
        selectedTheme={selectedTheme}
        searchValue={searchValue}
      />
    )

  return (
    <PaperGroup
      papersByCategories={papersByCategories}
      konnectors={konnectors}
      selectedTheme={selectedTheme}
    />
  )
}

Content.propTypes = {
  contacts: PropTypes.array,
  papers: PropTypes.array,
  konnectors: PropTypes.array,
  selectedTheme: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  searchValue: PropTypes.string
}

export default Content
