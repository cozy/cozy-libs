import React from 'react'
import PropTypes from 'prop-types'
import { ModalHeader } from 'cozy-ui/transpiled/react/Modal'
import KonnectorIcon from './KonnectorIcon'

const KonnectorModalHeader = ({ konnector, children }) => {
  return (
    <ModalHeader className="u-pr-2">
      <div className="u-flex u-flex-row u-w-100 u-flex-items-center">
        <div className="u-w-3 u-h-3 u-mr-half">
          <KonnectorIcon konnector={konnector} />
        </div>
        <div className="u-flex-grow-1 u-mr-half">
          <h3 className="u-title-h3 u-m-0">{konnector.name}</h3>
          {children}
        </div>
      </div>
    </ModalHeader>
  )
}

KonnectorModalHeader.PropTypes = {
  konnector: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default KonnectorModalHeader
