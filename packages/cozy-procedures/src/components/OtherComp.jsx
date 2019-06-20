import React, { Component } from 'react'
import template from '../templates/creditApplicationTemplate'
class Comp extends Component {
  render() {
    console.log('props', this.props)
    console.log('template', template)
    Object.values(template.documents).map(doc => {
      console.log({ doc })
    })
    return <div>other step</div>
  }
}

export default Comp
