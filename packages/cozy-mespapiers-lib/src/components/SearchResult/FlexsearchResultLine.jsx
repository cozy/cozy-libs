import PropTypes from 'prop-types'
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { isFile } from 'cozy-client/dist/models/file'
import Divider from 'cozy-ui/transpiled/react/MuiCozyTheme/Divider'
import ListItemByDoc from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem/ListItemByDoc'

import useActions from './useActions'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const FlexsearchResultLine = ({ doc, expandedAttributes, isFirst, isLast }) => {
  const actions = useActions(doc)
  const navigate = useNavigate()
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

  const handleClick = !isFile(doc)
    ? undefined
    : () => {
        const qualificationLabel = doc?.metadata?.qualification?.label

        if (isMultiSelectionActive) {
          changeCurrentMultiSelectionFile(doc)
        } else {
          navigate(`/paper/files/${qualificationLabel}/${doc._id}`, {
            state: { background: `${pathname}${search}` }
          })
        }
      }

  return (
    <>
      <ListItemByDoc
        doc={doc}
        actions={actions}
        expandedAttributesProps={{
          isExpandedAttributesActive: isFirst,
          expandedAttributes
        }}
        selectProps={{
          isSelectActive: isMultiSelectionActive,
          isSelected: isSelected(),
          isChecked: isChecked()
        }}
        onClick={handleClick}
      />
      {isFirst && !isLast && <Divider component="li" />}
    </>
  )
}

FlexsearchResultLine.propTypes = {
  doc: PropTypes.object,
  searchMatchingAttributes: PropTypes.array,
  isFirst: PropTypes.bool,
  isLast: PropTypes.bool
}

export default FlexsearchResultLine
