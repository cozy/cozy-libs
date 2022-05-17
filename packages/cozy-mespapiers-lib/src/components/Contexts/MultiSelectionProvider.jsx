import React, { createContext, useState, useEffect } from 'react'

const MultiSelectionContext = createContext()

const MultiSelectionProvider = ({ children }) => {
  const [multiSelectionState, setMultiSelectionState] = useState(false)
  const [multiSelectionFiles, setMultiSelectionFiles] = useState([])

  const addMultiSelectionFile = fileToAdd => {
    setMultiSelectionFiles(files => [...files, fileToAdd])
  }

  const removeMultiSelectionFile = fileToRemove => {
    setMultiSelectionFiles(files => {
      return files.filter(file => file._id !== fileToRemove._id)
    })
  }

  const removeAllMultiSelectionFiles = () => {
    setMultiSelectionFiles([])
  }

  useEffect(() => {
    // Resets the context by exiting the multi-selection mode
    if (!multiSelectionState) {
      removeAllMultiSelectionFiles()
    }
  }, [multiSelectionState])

  const value = {
    multiSelectionState,
    setMultiSelectionState,
    addMultiSelectionFile,
    removeMultiSelectionFile,
    removeAllMultiSelectionFiles,
    multiSelectionFiles
  }

  return (
    <MultiSelectionContext.Provider value={value}>
      {children}
    </MultiSelectionContext.Provider>
  )
}

export default MultiSelectionContext

export { MultiSelectionProvider }
