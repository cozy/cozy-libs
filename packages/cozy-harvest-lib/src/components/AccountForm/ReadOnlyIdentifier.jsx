import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Card from 'cozy-ui/transpiled/react/Card'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/Media'

import KonnectorIcon from '../KonnectorIcon'

const ReadOnlyIdentifier = props => {
  const { className, onClick, konnector, identifier, ...rest } = props

  return (
    <Card
      className={cx({ 'u-c-pointer': onClick }, className)}
      onClick={onClick}
      {...rest}
    >
      <Media>
        <Img>
          <KonnectorIcon konnector={konnector} className="u-w-1-half u-mr-1" />
        </Img>
        <Bd>{identifier}</Bd>
        <Img>
          <Icon icon="bottom-select" />
        </Img>
      </Media>
    </Card>
  )
}

ReadOnlyIdentifier.propTypes = {
  konnector: PropTypes.object.isRequired,
  identifier: PropTypes.string.isRequired
}

export default ReadOnlyIdentifier
