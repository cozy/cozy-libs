import PropTypes from 'prop-types'
import React from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'
import List from 'cozy-ui/transpiled/react/List'
import { hasExpandedAttributesDisplayed } from 'cozy-ui/transpiled/react/ListItem/ExpandedAttributes/helpers'

import FlexsearchResultLine from './FlexsearchResultLine'

const SeparatorWrapper = ({ hasExpandedAttributes, children, ...props }) => {
  if (!hasExpandedAttributes) return children
  return (
    <>
      <Divider component="li" />
      <List {...props}>{children}</List>
    </>
  )
}

const FlexsearchResult = ({
  filteredDocs,
  firstSearchResultMatchingAttributes
}) => {
  const firstDoc = filteredDocs[0]
  const otherDocs = filteredDocs.slice(1)
  const hasOtherDocs = otherDocs.length > 0
  const hasExpandedAttributesToDisplay = hasExpandedAttributesDisplayed({
    doc: firstDoc,
    expandedAttributes: firstSearchResultMatchingAttributes
  })

  return (
    <List className="u-pv-0">
      <FlexsearchResultLine
        doc={firstDoc}
        expandedAttributesProps={{
          isExpandedAttributesActive: true,
          expandedAttributes: firstSearchResultMatchingAttributes
        }}
      />
      {hasOtherDocs && (
        <SeparatorWrapper
          hasExpandedAttributes={hasExpandedAttributesToDisplay}
        >
          {otherDocs.map(doc => (
            <FlexsearchResultLine key={doc._id} doc={doc} />
          ))}
        </SeparatorWrapper>
      )}
    </List>
  )
}

FlexsearchResult.propTypes = {
  filteredDocs: PropTypes.arrayOf(PropTypes.object),
  firstSearchResultMatchingAttributes: PropTypes.array
}

export default FlexsearchResult
