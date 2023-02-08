import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'

import { isQueryLoading, useQueryAll } from 'cozy-client'
import Spinner from 'cozy-ui/transpiled/react/Spinner'

import {
  buildContactsQueryByIds,
  buildFilesQueryWithQualificationLabel
} from '../../helpers/queries'
import { getContactsRefIdsByFiles } from '../Papers/helpers'
import { usePapersDefinitions } from '../Hooks/usePapersDefinitions'
import Content from '../Home/Content'

const Home = ({ setSelectedThemeLabel }) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  const { papersDefinitions } = usePapersDefinitions()

  const isSearching = searchValue.length > 0 || !!selectedTheme
  const papersDefinitionsLabels = useMemo(
    () => papersDefinitions.map(paper => paper.label),
    [papersDefinitions]
  )

  const filesQueryByLabels = buildFilesQueryWithQualificationLabel()
  const { data: filesWithQualificationLabel, ...queryResult } = useQueryAll(
    filesQueryByLabels.definition,
    filesQueryByLabels.options
  )
  const isLoadingFiles = isQueryLoading(queryResult) || queryResult.hasMore

  const filesWithPapersDefinitionsLabels = useMemo(
    () =>
      filesWithQualificationLabel?.filter(file =>
        papersDefinitionsLabels.includes(file?.metadata?.qualification?.label)
      ) || [],
    [filesWithQualificationLabel, papersDefinitionsLabels]
  )

  const contactIds = getContactsRefIdsByFiles(filesWithPapersDefinitionsLabels)
  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    {
      ...contactsQueryByIds.options,
      enabled: isSearching && !isLoadingFiles
    }
  )
  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  if (isLoadingFiles || (isSearching && isLoadingContacts)) {
    return (
      <Spinner
        size="xxlarge"
        className="u-flex u-flex-justify-center u-mt-2 u-h-5"
      />
    )
  }

  return (
    <Content
      contacts={contacts}
      filesWithPapersDefinitionsLabels={filesWithPapersDefinitionsLabels}
      isLoadingFiles={isLoadingFiles}
      isLoadingContacts={isLoadingContacts}
      isSearching={isSearching}
      selectedTheme={selectedTheme}
      setSelectedTheme={setSelectedTheme}
      setSelectedThemeLabel={setSelectedThemeLabel}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
    />
  )
}

Home.propTypes = {
  setSelectedThemeLabel: PropTypes.func
}

export default Home
