/* global cozy */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import {
  withBreakpoints,
  AppTitle,
  MainTitle,
  BarButton
} from 'cozy-ui/transpiled/react'

const Topbar = ({ title, router, breakpoints: { isMobile } }) => {
  const hasCozyBar = !!cozy.bar

  if (isMobile && hasCozyBar) {
    const { BarLeft, BarCenter } = cozy.bar
    return (
      <>
        <BarLeft>
          <BarButton icon="back" onClick={router.goBack} />
        </BarLeft>
        <BarCenter>
          <AppTitle>{title}</AppTitle>
        </BarCenter>
      </>
    )
  } else {
    return <MainTitle className="u-mb-2">{title}</MainTitle>
  }
}

Topbar.propTypes = {
  title: PropTypes.string,
  router: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
}

Topbar.defaultProps = {
  title: ''
}

export default withBreakpoints()(withRouter(Topbar))
