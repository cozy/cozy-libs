import React from 'react'
import PropTypes from 'prop-types'

const ObjectFieldTemplate = props => (
  <div>
    {props.properties.map(element => {
      return (
        <div className="property-wrapper" key={element.name}>
          {element.content}
        </div>
      )
    })}
  </div>
)

ObjectFieldTemplate.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
}

export default ObjectFieldTemplate
