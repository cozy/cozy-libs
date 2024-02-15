import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useClient } from 'cozy-client'
import ListItemByDoc from 'cozy-ui/transpiled/react/ListItem/ListItemByDoc'

import { makeFlexsearchResultLineOnClick } from './helpers'
import useActions from './useActions'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const FlexsearchResultLine = ({ doc, expandedAttributesProps }) => {
  const actions = useActions([doc])
  const navigate = useNavigate()
  const client = useClient()
  const { pathname, search } = useLocation()
  const {
    isMultiSelectionActive,
    allMultiSelectionFiles,
    currentMultiSelectionFiles,
    changeCurrentMultiSelectionFile
  } = useMultiSelection()

  const isSelected = () => {
    return (
      isMultiSelectionActive &&
      allMultiSelectionFiles.some(file => file._id === doc._id)
    )
  }

  const isChecked = () => {
    return (
      currentMultiSelectionFiles.some(file => file._id === doc._id) ||
      allMultiSelectionFiles.some(file => file._id === doc._id)
    )
  }

  const handleClick = makeFlexsearchResultLineOnClick({
    client,
    doc,
    navigate,
    navigateState: { background: `${pathname}${search}` },
    isMultiSelectionActive,
    changeCurrentMultiSelectionFile
  })

  return (
    <>
      <ListItemByDoc
        doc={doc}
        actions={actions}
        expandedAttributesProps={expandedAttributesProps}
        selectProps={{
          isSelectActive: isMultiSelectionActive,
          isSelected: isSelected(),
          isChecked: isChecked()
        }}
        onClick={handleClick}
      />
    </>
  )
}

FlexsearchResultLine.propTypes = {
  doc: PropTypes.object,
  searchMatchingAttributes: PropTypes.array
}

export default FlexsearchResultLine
