import React, { createContext, useState, useEffect } from 'react'

const MultiSelectionContext = createContext()

const MultiSelectionProvider = ({ children }) => {
  const [isMultiSelectionActive, setIsMultiSelectionActive] = useState(false)
  const [multiSelectionFiles, setMultiSelectionFiles] = useState([])
  const [currentMultiSelectionFiles, setCurrentMultiSelectionFiles] = useState(
    []
  )

  const confirmCurrentMultiSelectionFiles = () => {
    removeAllCurrentMultiSelectionFiles()
    for (const file of currentMultiSelectionFiles) {
      addMultiSelectionFile(file)
    }
  }

  const addCurrentMultiSelectionFile = fileToAdd => {
    setCurrentMultiSelectionFiles(files => [...files, fileToAdd])
  }

  const removeCurentMultiSelectionFile = fileToRemove => {
    setCurrentMultiSelectionFiles(files => {
      return files.filter(file => file._id !== fileToRemove._id)
    })
  }

  const removeAllCurrentMultiSelectionFiles = () => {
    setCurrentMultiSelectionFiles([])
  }

  const addMultiSelectionFile = fileToAdd => {
    setMultiSelectionFiles(files => [...files, fileToAdd])
  }

  const removeMultiSelectionFile = fileToRemoveIndex => {
    setMultiSelectionFiles(files => {
      return files.filter((_, idx) => fileToRemoveIndex !== idx)
    })
  }

  const removeAllMultiSelectionFiles = () => {
    setMultiSelectionFiles([])
  }

  useEffect(() => {
    // Resets the context by exiting the multi-selection mode
    if (!isMultiSelectionActive) {
      removeAllMultiSelectionFiles()
      removeAllCurrentMultiSelectionFiles()
    }
  }, [isMultiSelectionActive])

  const value = {
    isMultiSelectionActive,
    multiSelectionFiles,
    setIsMultiSelectionActive,
    addMultiSelectionFile,
    removeMultiSelectionFile,
    removeAllMultiSelectionFiles,

    currentMultiSelectionFiles,
    removeAllCurrentMultiSelectionFiles,
    confirmCurrentMultiSelectionFiles,
    addCurrentMultiSelectionFile,
    removeCurentMultiSelectionFile
  }

  return (
    <MultiSelectionContext.Provider value={value}>
      {children}
    </MultiSelectionContext.Provider>
  )
}

export default MultiSelectionContext

export { MultiSelectionProvider }
