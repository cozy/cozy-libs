import React from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router'
import Topbar from './Topbar'
import creditApplicationTemplate from '../templates/creditApplicationTemplate'
import {
  Title,
  SubTitle,
  Caption,
  Button,
  translate
} from 'cozy-ui/transpiled/react'

const Overview = ({ personalData, location, t }) => {
  const personalDataFieldsTotal = Object.keys(personalData).length
  const personalDataFieldsCompleted = Object.values(personalData).filter(
    Boolean
  ).length

  const rootPath =
    location.pathname + (location.pathname.endsWith('/') ? '' : '/')

  return (
    <div>
      <Topbar title={creditApplicationTemplate.name} />
      <Title className="u-mb-1">{t('overview.subtitle')}</Title>
      <div className="u-mb-1">
        <SubTitle>{t('overview.request')}</SubTitle>
        <Link to={`${rootPath}amount`}>Amount</Link>
        <Link to={`${rootPath}duration`}>Duration</Link>
      </div>
      <div className="u-mb-1">
        <SubTitle>{t('overview.documents')}</SubTitle>
        <Link to={`${rootPath}documents`}>Documents</Link>
      </div>
      <div className="u-mb-1">
        <SubTitle>{t('overview.infos')}</SubTitle>
        <Link to={`${rootPath}personal`}>Personal infos</Link>
        {personalDataFieldsCompleted}/{personalDataFieldsTotal}
      </div>
      <Caption>{t('overview.notice')}</Caption>
      <Button label={t('overview.button')} extension="full" />
    </div>
  )
}

Overview.propTypes = {
  personalData: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  t: PropTypes.func.isRequired
}

Overview.defaultProps = {
  personalData: {},
  location: {
    pathname: '/'
  }
}

export default translate()(withRouter(Overview))
