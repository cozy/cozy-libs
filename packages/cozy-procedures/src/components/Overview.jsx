import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'

const Overview = ({ personalData, location }) => {
  const personalDataFieldsTotal = Object.keys(personalData).length
  const personalDataFieldsCompleted = Object.values(personalData).filter(
    Boolean
  ).length

  const rootPath =
    location.pathname + (location.pathname.endsWith('/') ? '' : '/')

  return (
    <div>
      <h1>{creditApplicationTemplate.name}</h1>
      <div>
        <Link to={`${rootPath}other`}>Other</Link>
      </div>
      <div>
        <Link to={`${rootPath}personal`}>Personal infos</Link>
        {personalDataFieldsCompleted}/{personalDataFieldsTotal}
      </div>
    </div>
  )
}

Overview.propTypes = {
  personalData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string
  })
}

Overview.defaultProps = {
  personalData: {},
  location: {
    pathname: '/'
  }
}

export default withRouter(Overview)
