import uniq from 'lodash/uniq'
import PropTypes from 'prop-types'
import React from 'react'

import SharingContext from '../context'

export const SharedDocuments = ({ children }) => (
  <SharingContext.Consumer>
    {({ byDocId, hasLoadedAtLeastOnePage, allLoaded } = { byDocId: [] }) => {
      const sharedDocuments = uniq(Object.keys(byDocId))
      return children({
        sharedDocuments,
        hasLoadedAtLeastOnePage,
        allLoaded
      })
    }}
  </SharingContext.Consumer>
)

SharedDocuments.propTypes = {
  children: PropTypes.func
}

export default SharedDocuments
