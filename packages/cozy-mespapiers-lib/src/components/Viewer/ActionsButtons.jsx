import PropTypes from 'prop-types'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ForwardButton } from 'cozy-ui/transpiled/react/Viewer'

import SelectFileButton from './SelectFileButton'
import { useFileSharing } from '../Contexts/FileSharingProvider'
import { useMultiSelection } from '../Hooks/useMultiSelection'

const ActionsButtons = ({ file, toolbar }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isMultiSelectionActive } = useMultiSelection()
  const { isFileSharingAvailable } = useFileSharing()

  if (isMultiSelectionActive) return null

  const handleForwardClick = () => {
    const fileId = file._id
    if (isFileSharingAvailable) {
      navigate(`${pathname}/share`, {
        state: { fileId }
      })
    } else {
      navigate(`${pathname}/forward/${fileId}`)
    }
  }

  return (
    <>
      <ForwardButton
        file={file}
        variant={toolbar ? 'iconButton' : 'default'}
        onClick={handleForwardClick}
      />
      <SelectFileButton file={file} />
    </>
  )
}

ActionsButtons.propTypes = {
  file: PropTypes.object,
  toolbar: PropTypes.bool
}

export default ActionsButtons
