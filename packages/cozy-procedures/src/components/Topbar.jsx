import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import BarButton from 'cozy-ui/transpiled/react/BarButton'
import AppTitle from 'cozy-ui/transpiled/react/AppTitle'

const Topbar = ({ title, router }) => (
  <div>
    <BarButton icon="back" onClick={router.goBack} />
    <AppTitle>{title}</AppTitle>
  </div>
)

Topbar.propTypes = {
  title: PropTypes.string,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
}

Topbar.defaultProps = {
  title: ''
}

export default withRouter(Topbar)
