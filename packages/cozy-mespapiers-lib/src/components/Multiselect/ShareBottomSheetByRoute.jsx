import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import ShareBottomSheet from './ShareBottomSheet'

const ShareBottomSheetByRoute = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  return (
    <ShareBottomSheet
      onClose={() => navigate('..')}
      fileId={state?.fileId}
      docs={state?.docs || []}
    />
  )
}

export default ShareBottomSheetByRoute
