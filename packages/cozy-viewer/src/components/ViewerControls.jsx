import cx from 'classnames'
import Hammer from 'hammerjs'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import { infoWidth } from './InformationPanel'
import Navigation from './Navigation'
import Toolbar from './Toolbar'
import styles from './styles.styl'
import { toolbarPropsPropType } from '../proptypes'
import { useViewer } from '../providers/ViewerProvider'

const ACTIONS_HIDE_DELAY = 3000

const customStyles = () => ({
  viewerControlsWithInfo: {
    width: `calc(100% - ${infoWidth}) !important`
  }
})

class ViewerControls extends Component {
  state = {
    hidden: false,
    gestures: null
  }

  _mounted = false

  showControls = () => {
    if (this._mounted) {
      this.setState({ hidden: false })
      this.hideAfterDelay()
      document.removeEventListener('mousemove', this.showControls)
      document.addEventListener('mousemove', this.hideAfterDelay)
    }
  }

  hideControls = () => {
    if (this._mounted) {
      this.setState({ hidden: true })
      document.removeEventListener('mousemove', this.hideAfterDelay)
      document.addEventListener('mousemove', this.showControls)
    }
  }

  hideAfterDelay = () => {
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(() => {
      this.hideControls()
    }, ACTIONS_HIDE_DELAY)
  }

  onSwipe = e => {
    if (e.direction === Hammer.DIRECTION_LEFT) this.props.onNext()
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.props.onPrevious()
  }

  initGestures = () => {
    const gestures = new Hammer(
      this.wrapped,
      this.props.isDesktop
        ? {
            cssProps: {
              userSelect: 'auto'
            }
          }
        : {}
    )
    if (!this.props.isDesktop) gestures.on('swipe', this.onSwipe)

    return gestures
  }

  componentDidMount() {
    this._mounted = true
    clearTimeout(this.hideTimeout)
    this.hideAfterDelay()
    const gestures = this.initGestures()
    this.setState({ gestures })
  }

  componentWillUnmount() {
    this._mounted = false
    clearTimeout(this.hideTimeout)
    if (this.state.gestures) this.state.gestures.destroy()
  }

  renderChildren(children) {
    if (!children) return null

    return React.Children.map(children, child => {
      if (
        child?.type?.name === 'ViewerByFile' ||
        child?.type?.displayName === 'ViewerByFile'
      ) {
        return React.cloneElement(child, {
          gestures: this.state.gestures,
          gesturesRef: this.wrapped,
          onSwipe: this.onSwipe
        })
      }
    })
  }

  render() {
    const {
      onClose,
      hasPrevious,
      hasNext,
      onPrevious,
      onNext,
      expanded,
      toolbarProps,
      showNavigation,
      showInfoPanel,
      children,
      classes,
      isDesktop
    } = this.props
    const { showToolbar, showClose, toolbarRef, showFilePath } = toolbarProps
    const { hidden } = this.state

    return (
      <div
        className={cx(styles['viewer-controls'], {
          [styles['viewer-controls--expanded']]: expanded,
          [classes.viewerControlsWithInfo]: showInfoPanel
        })}
        ref={wrapped => {
          this.wrapped = wrapped
        }}
      >
        {showToolbar && (
          <Toolbar
            toolbarRef={toolbarRef}
            showFilePath={showFilePath}
            onMouseEnter={this.showControls}
            onMouseLeave={this.hideControls}
            onClose={showClose ? onClose : undefined}
          >
            {children}
          </Toolbar>
        )}
        {showNavigation && isDesktop && hasPrevious && (
          <Navigation
            className={styles['viewer-nav--previous']}
            hidden={hidden}
            onMouseEnter={this.showControls}
            onMouseLeave={this.hideControls}
            onClick={onPrevious}
          />
        )}
        {this.renderChildren(children)}
        {showNavigation && isDesktop && hasNext && (
          <Navigation
            className={styles['viewer-nav--next']}
            hidden={hidden}
            onMouseEnter={this.showControls}
            onMouseLeave={this.hideControls}
            onClick={onNext}
          />
        )}
      </div>
    )
  }
}

ViewerControls.propTypes = {
  isDesktop: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  toolbarProps: PropTypes.shape(toolbarPropsPropType),
  showNavigation: PropTypes.bool.isRequired,
  showInfoPanel: PropTypes.bool
}

const ViewerControlsWrapper = props => {
  const { file } = useViewer()
  const { isDesktop } = useBreakpoints()

  // this `expanded` property makes the next/previous controls cover the displayed image
  const expanded = file && file.class === 'image'

  return <ViewerControls expanded={expanded} isDesktop={isDesktop} {...props} />
}

export default withStyles(customStyles)(ViewerControlsWrapper)
