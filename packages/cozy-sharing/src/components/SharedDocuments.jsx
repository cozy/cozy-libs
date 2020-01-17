import React from 'react'
import PropTypes from 'prop-types'
import uniq from 'lodash/uniq'
import SharingContext from '../context'

export const SharedDocuments = ({ children }) => (
  <SharingContext.Consumer>
    {({ byDocId, hasLoadedAtLeastOnePage } = { byDocId: [] }) => {
      const sharedDocuments = uniq(Object.keys(byDocId))
      return children({
        sharedDocuments,
        hasLoadedAtLeastOnePage
      })
    }}
  </SharingContext.Consumer>
)

SharedDocuments.propTypes = {
  children: PropTypes.func
}

export default SharedDocuments
