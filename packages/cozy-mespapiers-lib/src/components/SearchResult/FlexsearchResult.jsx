import PropTypes from 'prop-types'
import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import ListSubheader from 'cozy-ui/transpiled/react/MuiCozyTheme/ListSubheader'

import FlexsearchResultLine from './FlexsearchResultLine'

const FlexsearchResult = ({
  filteredDocs,
  firstSearchResultMatchingAttributes
}) => {
  const { t } = useI18n()

  const firstDoc = filteredDocs[0]
  const otherDocs = filteredDocs.slice(1)
  const hasOtherDocs = otherDocs.length > 0

  return (
    <>
      <ListSubheader>{t('PapersList.subheader')}</ListSubheader>
      <List className="u-pv-0">
        <FlexsearchResultLine
          doc={firstDoc}
          expandedAttributesProps={{
            isExpandedAttributesActive: true,
            expandedAttributes: firstSearchResultMatchingAttributes
          }}
        />
        {hasOtherDocs && (
          <>
            <Divider component="li" />
            <List>
              {otherDocs.map(doc => (
                <FlexsearchResultLine key={doc._id} doc={doc} />
              ))}
            </List>
          </>
        )}
      </List>
    </>
  )
}

FlexsearchResult.propTypes = {
  filteredDocs: PropTypes.arrayOf(PropTypes.object),
  firstSearchResultMatchingAttributes: PropTypes.array
}

export default FlexsearchResult
