import PropTypes from 'prop-types'
import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import FlexsearchResultLine from './FlexsearchResultLine'

const FlexsearchResult = ({
  filteredDocs,
  firstSearchResultMatchingAttributes
}) => {
  const { t } = useI18n()

  return (
    <>
      <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      <List className="u-pv-0">
        {filteredDocs.map((doc, index) => {
          const isFirst = index === 0

          return (
            <FlexsearchResultLine
              key={doc._id}
              doc={doc}
              expandedAttributes={
                isFirst ? firstSearchResultMatchingAttributes : undefined
              }
              isFirst={isFirst}
              isLast={index === filteredDocs.length - 1}
            />
          )
        })}
      </List>
    </>
  )
}

FlexsearchResult.propTypes = {
  filteredDocs: PropTypes.arrayOf(PropTypes.object),
  firstSearchResultMatchingAttributes: PropTypes.array
}

export default FlexsearchResult
