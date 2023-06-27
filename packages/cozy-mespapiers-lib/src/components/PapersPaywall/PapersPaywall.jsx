import React from 'react'

import { MaxPapersPaywall } from 'cozy-ui/transpiled/react/Paywall'

import { computeMaxPapers } from './helpers'

/**
 * @param {Object} props
 * @param {Function} props.onClose
 */
const PapersPaywall = ({ onClose }) => {
  const max = computeMaxPapers()
  return <MaxPapersPaywall max={max} onClose={onClose} />
}

export default PapersPaywall
