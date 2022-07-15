import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'

import { isQueryLoading, useQueryAll, models } from 'cozy-client'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Box from 'cozy-ui/transpiled/react/Box'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Badge from 'cozy-ui/transpiled/react/Badge'
import makeStyles from 'cozy-ui/transpiled/react/helpers/makeStyles'

import ThemesFilter from '../ThemesFilter'
import SearchInput from '../SearchInput'
import PaperGroup from '../Papers/PaperGroup'
import FeaturedPlaceholdersList from '../Placeholders/FeaturedPlaceholdersList'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import { useScannerI18n } from '../Hooks/useScannerI18n'
import { useMultiSelection } from '../Hooks/useMultiSelection'
import { buildFilesQueryWithQualificationLabel } from '../../helpers/queries'
import { getFeaturedPlaceholders } from '../../helpers/findPlaceholders'
import HomeCloud from '../../assets/icons/HomeCloud.svg'
import { filterPapersByThemeAndSearchValue } from './helpers'
import HomeToolbar from './HomeToolbar'
import SearchResult from '../SearchResult/SearchResult'

const useStyles = makeStyles(theme => ({
  iconButton: {
    color: theme.palette.text.icon,
    boxShadow: theme.shadows[2],
    backgroundColor: theme.palette.background.paper,
    marginLeft: '0.5rem'
  }
}))

const {
  themes: { themesList }
} = models.document

const Home = ({ setSelectedThemeLabel }) => {
  const { isMultiSelectionActive } = useMultiSelection()
  const [searchValue, setSearchValue] = useState('')
  const [isThemesFilterDisplayed, setIsThemesFilterDisplayed] = useState(
    !isMultiSelectionActive
  )
  const [selectedTheme, setSelectedTheme] = useState('')
  const styles = useStyles()
  const { t } = useI18n()
  const scannerT = useScannerI18n()
  const { papersDefinitions } = usePapersDefinitions()

  const papersDefinitionsLabels = useMemo(
    () => papersDefinitions.map(paper => paper.label),
    [papersDefinitions]
  )
  const filesQueryByLabels = buildFilesQueryWithQualificationLabel()

  const { data: filesWithQualificationLabel, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )

  const filesWithPapersDefinitionsLabels = useMemo(
    () =>
      filesWithQualificationLabel?.filter(file =>
        papersDefinitionsLabels.includes(file?.metadata?.qualification?.label)
      ) || [],
    [filesWithQualificationLabel, papersDefinitionsLabels]
  )

  const isLoading = isQueryLoading(queryResult) || queryResult.hasMore
  const isSearching = searchValue.length > 0 || selectedTheme

  const allPapersByCategories = useMemo(
    () =>
      uniqBy(filesWithPapersDefinitionsLabels, 'metadata.qualification.label'),
    [filesWithPapersDefinitionsLabels]
  )

  const filteredPapers = filterPapersByThemeAndSearchValue({
    files: isSearching
      ? filesWithPapersDefinitionsLabels
      : allPapersByCategories,
    theme: selectedTheme,
    search: searchValue,
    scannerT
  })

  const featuredPlaceholders = useMemo(
    () =>
      getFeaturedPlaceholders({
        papersDefinitions,
        files: filesWithPapersDefinitionsLabels,
        selectedTheme
      }),
    [papersDefinitions, filesWithPapersDefinitionsLabels, selectedTheme]
  )

  const handleThemeSelection = nextValue => {
    setSelectedTheme(oldValue => (nextValue === oldValue ? '' : nextValue))
  }

  const handleThemesFilterDisplayed = isDisplayed => {
    setIsThemesFilterDisplayed(isDisplayed)
  }

  if (isLoading) {
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
  }

  return (
    <>
      {isMultiSelectionActive && <HomeToolbar />}

      <div className="u-flex u-flex-column-s u-mv-1 u-ph-half">
        <Box className="u-flex u-flex-items-center u-mb-half-s" flex="1 1 auto">
          <SearchInput
            value={searchValue}
            onChange={ev => setSearchValue(ev.target.value)}
            onFocus={() => handleThemesFilterDisplayed(false)}
          />
          {!isThemesFilterDisplayed && (
            <Badge
              badgeContent={selectedTheme ? 1 : 0}
              showZero={false}
              color="primary"
              variant="standard"
              size="medium"
            >
              <IconButton
                data-testid="SwitchButton"
                className={styles.iconButton}
                size="medium"
                onClick={() => handleThemesFilterDisplayed(true)}
              >
                <Icon icon="setting" />
              </IconButton>
            </Badge>
          )}
        </Box>
        <Box className="u-flex u-flex-justify-center" flexWrap="wrap">
          {isThemesFilterDisplayed && (
            <ThemesFilter
              items={themesList}
              selectedTheme={selectedTheme}
              handleThemeSelection={handleThemeSelection}
            />
          )}
        </Box>
      </div>

      {allPapersByCategories.length > 0 ? (
        !isSearching ? (
          <PaperGroup
            allPapersByCategories={filteredPapers}
            setSelectedThemeLabel={setSelectedThemeLabel}
          />
        ) : (
          <SearchResult filteredPapers={filteredPapers} />
        )
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

Home.propTypes = {
  setSelectedThemeLabel: PropTypes.func
}

export default Home
