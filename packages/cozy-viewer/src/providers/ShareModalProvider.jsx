import React, { useMemo, useContext, useState } from 'react'

import { ShareModal } from 'cozy-sharing'

import { useViewer } from './ViewerProvider'

export const ShareModalContext = React.createContext()

export const useShareModal = () => {
  const context = useContext(ShareModalContext)

  if (!context) {
    throw new Error('useShareModal must be used within a ShareModalProvider')
  }
  return context
}

const ShareModalProvider = ({ children }) => {
  const { file } = useViewer()
  const [showShareModal, setShowShareModal] = useState(false)

  const value = useMemo(
    () => ({
      setShowShareModal
    }),
    []
  )

  return (
    <ShareModalContext.Provider value={value}>
      {children}
      {showShareModal && (
        <ShareModal
          document={file}
          documentType="Files"
          sharingDesc={file.name}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </ShareModalContext.Provider>
  )
}

export default React.memo(ShareModalProvider)
