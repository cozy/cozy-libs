import React, { useContext, useState } from 'react'

export const ViewerContext = React.createContext()

export const useViewer = () => {
  const context = useContext(ViewerContext)

  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider')
  }
  return context
}

const ViewerProvider = ({
  file,
  isPublic,
  isReadOnly,
  componentsProps,
  children
}) => {
  const [isOpenAiAssistant, setIsOpenAiAssistant] = useState(false)
  const [pdfPageCount, setPdfPageCount] = useState(null)

  return (
    <ViewerContext.Provider
      value={{
        file,
        isPublic,
        componentsProps,
        isReadOnly,
        isOpenAiAssistant,
        setIsOpenAiAssistant,
        pdfPageCount,
        setPdfPageCount
      }}
    >
      {children}
    </ViewerContext.Provider>
  )
}

export default React.memo(ViewerProvider)
