import React from 'react'
import PropTypes from 'prop-types'

import { isQueryLoading, useQueryAll, getReferencedBy } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Empty from 'cozy-ui/transpiled/react/Empty'
import Spinner from 'cozy-ui/transpiled/react/Spinner'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import PaperItem from '../Papers/PaperItem'
import { CONTACTS_DOCTYPE } from '../../doctypes'
import { buildContactsQueryByIds } from '../../helpers/queries'
import { buildFilesByContacts } from '../Papers/helpers'
import HomeCloud from '../../assets/icons/HomeCloud.svg'

const SearchResult = ({ filteredPapers }) => {
  const { t } = useI18n()

  const contactIds = filteredPapers.flatMap(file => {
    return getReferencedBy(file, CONTACTS_DOCTYPE).map(
      contactRef => contactRef.id
    )
  })

  const contactsQueryByIds = buildContactsQueryByIds(contactIds)
  const { data: contacts, ...contactQueryResult } = useQueryAll(
    contactsQueryByIds.definition,
    contactsQueryByIds.options
  )

  const isLoadingContacts =
    isQueryLoading(contactQueryResult) || contactQueryResult.hasMore

  const filesWithContacts = !isLoadingContacts
    ? buildFilesByContacts({
        files: filteredPapers,
        contacts,
        t
      })
    : []

  if (filesWithContacts.length === 0 && !isLoadingContacts) {
    return (
      <Empty
        icon={HomeCloud}
        iconSize="large"
        title={t('Home.Empty.title')}
        text={t('Home.Empty.text')}
        className="u-ph-1"
      />
    )
  }

  return filesWithContacts.length > 0 ? (
    <>
      <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      <List>
        {filesWithContacts.map(({ contact, papers }) => {
          return papers.list.map(paper => {
            return (
              <PaperItem key={paper._id} paper={paper} contactNames={contact} />
            )
          })
        })}
      </List>
    </>
  ) : (
    <Spinner
      size="xxlarge"
      className="u-flex u-flex-justify-center u-mt-2 u-h-5"
    />
  )
}

SearchResult.propTypes = {
  filteredPapers: PropTypes.arrayOf(PropTypes.object)
}

export default SearchResult
