import { useState, useEffect } from 'react'

const sharingPathnames = ['/preview']

export const useShouldDisplay = location => {
  const [shouldDisplay, setDisplay] = useState(false)

  useEffect(() => {
    setDisplay(sharingPathnames.includes(location.pathname))
  }, [location])

  return shouldDisplay
}
