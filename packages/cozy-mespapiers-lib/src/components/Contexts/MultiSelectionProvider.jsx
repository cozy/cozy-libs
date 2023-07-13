import React, { createContext, useState, useEffect } from 'react'

const MultiSelectionContext = createContext()

const MultiSelectionProvider = ({ children }) => {
  const [isMultiSelectionActive, setIsMultiSelectionActive] = useState(false)
  const [allMultiSelectionFiles, setAllMultiSelectionFiles] = useState([])
  const [currentMultiSelectionFiles, setCurrentMultiSelectionFiles] = useState(
    []
  )
  const [selectedQualificationLabel, setSelectedQualificationLabel] =
    useState(null)

  const confirmCurrentMultiSelectionFiles = () => {
    removeAllCurrentMultiSelectionFiles()
    for (const file of currentMultiSelectionFiles) {
      addMultiSelectionFile(file)
    }
  }

  const changeCurrentMultiSelectionFile = fileToAdd => {
    const fileAlreadySelected = currentMultiSelectionFiles.some(
      file => file._id === fileToAdd._id
    )
    if (fileAlreadySelected) removeCurrentMultiSelectionFile(fileToAdd)
    else setCurrentMultiSelectionFiles(files => [...files, fileToAdd])
  }

  const removeCurrentMultiSelectionFile = fileToRemove => {
    setCurrentMultiSelectionFiles(files => {
      return files.filter(file => file._id !== fileToRemove._id)
    })
  }

  const removeAllCurrentMultiSelectionFiles = () => {
    setCurrentMultiSelectionFiles([])
  }

  const addMultiSelectionFile = fileToAdd => {
    setAllMultiSelectionFiles(files => [...files, fileToAdd])
  }

  const removeMultiSelectionFile = fileToRemoveIndex => {
    setAllMultiSelectionFiles(files => {
      return files.filter((_, idx) => fileToRemoveIndex !== idx)
    })
  }

  const removeAllMultiSelectionFiles = () => {
    setAllMultiSelectionFiles([])
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
    allMultiSelectionFiles,
    setIsMultiSelectionActive,
    addMultiSelectionFile,
    removeMultiSelectionFile,
    removeAllMultiSelectionFiles,
    selectedQualificationLabel,
    setSelectedQualificationLabel,

    currentMultiSelectionFiles,
    removeAllCurrentMultiSelectionFiles,
    confirmCurrentMultiSelectionFiles,
    changeCurrentMultiSelectionFile,
    removeCurrentMultiSelectionFile
  }

  return (
    <MultiSelectionContext.Provider value={value}>
      {children}
    </MultiSelectionContext.Provider>
  )
}

export default MultiSelectionContext

export { MultiSelectionProvider }
