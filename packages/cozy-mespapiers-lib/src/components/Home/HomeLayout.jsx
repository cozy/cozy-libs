import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'

import Empty from 'cozy-ui/transpiled/react/Empty'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'

import HomeToolbar from './HomeToolbar'
import SearchHeader from './SearchHeader'
import Content from './Content'

const HomeLayout = ({
  contacts,
  filesWithPapersDefinitionsLabels,
  setSelectedThemeLabel
}) => {
  const { t } = useI18n()
  const [selectedTheme, setSelectedTheme] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const { isMultiSelectionActive } = useMultiSelection()
  const { papersDefinitions } = usePapersDefinitions()

  const allPapersByCategories = useMemo(
    () =>
      uniqBy(filesWithPapersDefinitionsLabels, 'metadata.qualification.label'),
    [filesWithPapersDefinitionsLabels]
  )

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: filesWithPapersDefinitionsLabels,
        selectedTheme
      }),
    [papersDefinitions, filesWithPapersDefinitionsLabels, selectedTheme]
  )

  const hasResult = allPapersByCategories.length > 0

  return (
    <>
      {isMultiSelectionActive && <HomeToolbar />}
      <SearchHeader
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      {hasResult ? (
        <Content
          contacts={contacts}
          filesWithPapersDefinitionsLabels={filesWithPapersDefinitionsLabels}
          selectedTheme={selectedTheme}
          searchValue={searchValue}
          allPapersByCategories={allPapersByCategories}
          setSelectedThemeLabel={setSelectedThemeLabel}
        />
      ) : (
        <Empty
          icon={HomeCloud}
          iconSize="large"
          title={t('Home.Empty.title')}
          text={t('Home.Empty.text')}
          className="u-ph-1"
        />
      )}
      {!isMultiSelectionActive && (
        <FeaturedPlaceholdersList featuredPlaceholders={featuredPlaceholders} />
      )}
    </>
  )
}

HomeLayout.propTypes = {
  contacts: PropTypes.array,
  filesWithPapersDefinitionsLabels: PropTypes.array,
  setSelectedThemeLabel: PropTypes.string
}

export default HomeLayout
