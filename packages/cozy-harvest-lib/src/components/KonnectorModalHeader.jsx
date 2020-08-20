import React from 'react'
import PropTypes from 'prop-types'
import { ModalHeader } from 'cozy-ui/transpiled/react/Modal'
import KonnectorIcon from './KonnectorIcon'
import { Media, Img } from 'cozy-ui/transpiled/react/Media'

const KonnectorModalHeader = ({ konnector, children }) => {
  return (
    <ModalHeader className="u-pr-2">
      <Media>
        <Img className="u-w-3 u-h-3 u-mr-1">
          <KonnectorIcon konnector={konnector} />
        </Img>
        <div className="u-flex-grow-1 u-mr-1">
          <h3 className="u-title-h3 u-m-0">{konnector.name}</h3>
          {children}
        </div>
      </Media>
    </ModalHeader>
  )
}

KonnectorModalHeader.propTypes = {
  konnector: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default KonnectorModalHeader
