import React, { useContext } from 'react'

export const ViewerContext = React.createContext()

export const useViewer = () => {
  const context = useContext(ViewerContext)

  if (!context) {
    throw new Error('useViewer must be used within a ViewerProvider')
  }
  return context
}

const ViewerProvider = ({ file, isPublic, isReadOnly, children }) => {
  return (
    <ViewerContext.Provider
      value={{
        file,
        isPublic,
        isReadOnly
      }}
    >
      {children}
    </ViewerContext.Provider>
  )
}

export default React.memo(ViewerProvider)
