import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router'
import Topbar from './Topbar'
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
      <Topbar title={creditApplicationTemplate.name} />
      <div>
        <Link to={`${rootPath}amount`}>Amount</Link>
        <Link to={`${rootPath}duration`}>Duration</Link>
      </div>
      <div>
        <Link to={`${rootPath}personal`}>Personal infos</Link>
        {personalDataFieldsCompleted}/{personalDataFieldsTotal}
      </div>
      <div>
        <Link to={`${rootPath}documents`}>Documents</Link>
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
