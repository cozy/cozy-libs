import PropTypes from 'prop-types'
import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { hasExpandedAttributesDisplayed } from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem/ExpandedAttributes/helpers'

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
  const { f, lang } = useI18n()

  const firstDoc = filteredDocs[0]
  const otherDocs = filteredDocs.slice(1)
  const hasOtherDocs = otherDocs.length > 0
  const hasExpandedAttributesToDisplay = hasExpandedAttributesDisplayed({
    doc: firstDoc,
    expandedAttributes: firstSearchResultMatchingAttributes,
    f,
    lang
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
