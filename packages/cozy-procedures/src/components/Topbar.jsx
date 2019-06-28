/* global cozy */
import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import flow from 'lodash/flow'
import {
  translate,
  withBreakpoints,
  AppTitle,
  MainTitle,
  BarButton,
  Button
} from 'cozy-ui/transpiled/react'

const Topbar = ({ t, title, router, breakpoints: { isMobile } }) => {
  const hasCozyBar = !!cozy.bar

  if (isMobile && hasCozyBar) {
    const { BarLeft, BarCenter } = cozy.bar
    return (
      <>
        <BarLeft>
          <BarButton onClick={router.goBack} icon="back" label={t('back')} />
        </BarLeft>
        <BarCenter>
          <AppTitle>{title}</AppTitle>
        </BarCenter>
      </>
    )
  } else {
    return (
      <div className="u-flex u-flex-items-center u-mb-2">
        <Button
          onClick={router.goBack}
          className="u-mr-1"
          theme="secondary"
          subtle
          icon="previous"
          iconOnly
          label={t('back')}
          extension="narrow"
        />
        <MainTitle>{title}</MainTitle>
      </div>
    )
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

export default flow(
  translate(),
  withBreakpoints(),
  withRouter
)(Topbar)
