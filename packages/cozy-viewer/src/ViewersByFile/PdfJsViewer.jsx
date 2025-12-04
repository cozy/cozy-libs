import cx from 'classnames'
import flow from 'lodash/flow'
import throttle from 'lodash/throttle'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Document, Page } from 'react-pdf'

import styles from './styles.styl'
import NoViewer from '../NoViewer'
import ToolbarButton from '../components/PdfToolbarButton'
import ViewerSpinner from '../components/ViewerSpinner'
import withFileUrl from '../hoc/withFileUrl'
import { withViewerLocales } from '../hoc/withViewerLocales'
import { ViewerContext } from '../providers/ViewerProvider'

export const MIN_SCALE = 0.25
export const MAX_SCALE = 3
export const MAX_PAGES = 40
export const MAX_SIZE_FILE = 10_485_760 // 10MB
const KEY_CODE_UP = 38
const KEY_CODE_DOWN = 40
const OPACITY_DELAY = 1_000
let timeoutOpacity

const makeInputPageStyle = nbPages => {
  const maxWidth = Math.max(1, String(Math.abs(nbPages)).length - 1)
  return {
    maxWidth: `${maxWidth}.5rem`
  }
}

export class PdfJsViewer extends Component {
  static contextType = ViewerContext

  state = {
    totalPages: 1,
    scale: 1,
    currentPage: 1,
    inputPageValue: 1,
    loaded: false,
    errored: false,
    width: null,
    renderAllPages: false,
    toolbarDisplayed: true,
    keepToolbarDisplayed: false,
    isInputPageFocused: false
  }

  constructor() {
    super()
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.setWrapperSize()
    this.resizeListener = throttle(this.setWrapperSize, 500)
    this.mouseMoveListener = throttle(this.onMouseMove, OPACITY_DELAY / 2)
    window.addEventListener('resize', this.resizeListener)
    document.addEventListener('mousemove', this.mouseMoveListener)
    document.addEventListener('keyup', this.onKeyUp, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
    document.removeEventListener('mousemove', this.mouseMoveListener)
    document.removeEventListener('keyup', this.onKeyUp, false)
    if (timeoutOpacity) {
      clearTimeout(timeoutOpacity)
    }
  }

  onMouseMove = () => {
    if (!this.state.toolbarDisplayed) {
      this.setState({ toolbarDisplayed: true })
    }
    if (timeoutOpacity) {
      clearTimeout(timeoutOpacity)
    }
    timeoutOpacity = setTimeout(() => {
      this.setState({ toolbarDisplayed: false })
    }, OPACITY_DELAY)
  }

  onKeyUp = e => {
    if (e.keyCode === KEY_CODE_UP) this.previousPage()
    else if (e.keyCode === KEY_CODE_DOWN) this.nextPage()
    this.onMouseMove()
  }

  toggleGestures(enable) {
    if (!this.props.gestures) return
    this.props.gestures.get('swipe').set({ enable })
    this.props.gestures.get('pan').set({ enable })
  }

  setWrapperSize = () => {
    const width = this.wrapper
      ? this.wrapper.getBoundingClientRect().width
      : null
    this.setState({ width })
  }

  onLoadSuccess = ({ numPages }) => {
    this.setState({
      totalPages: numPages,
      renderAllPages:
        numPages <= MAX_PAGES &&
        parseInt(this.props.file.size, 10) <= MAX_SIZE_FILE,
      loaded: true
    })

    // Update page count in ViewerContext for AI summary compatibility check
    if (this.context && this.context.setPdfPageCount) {
      this.context.setPdfPageCount(numPages)
    }
  }

  onLoadError = error => {
    // eslint-disable-next-line no-console
    console.warn(error)
    this.setState({
      errored: true
    })
  }

  nextPage = () => {
    this.setState(state => {
      const value = Math.min(state.currentPage + 1, state.totalPages)
      return {
        currentPage: value,
        inputPageValue: value
      }
    })
  }

  previousPage = () => {
    this.setState(state => {
      const value = Math.max(state.currentPage - 1, 1)
      return {
        currentPage: value,
        inputPageValue: value
      }
    })
  }

  scaleUp = () => {
    this.setState(state => {
      const previousScale = state.scale
      const scale = Math.min(previousScale + 0.25, MAX_SCALE)
      if (scale > 1 && previousScale <= 1) this.toggleGestures(false)
      return { scale }
    })
  }

  scaleDown = () => {
    this.setState(state => {
      const previousScale = state.scale
      const scale = Math.max(previousScale - 0.25, MIN_SCALE)
      if (scale <= 1 && previousScale > 1) this.toggleGestures(true)
      return { scale }
    })
  }

  handleInputPageChange = evt => {
    const value = evt.target.value
    if (value === '' || (value <= this.state.totalPages && value > 0)) {
      this.setState({ inputPageValue: value })
    }
  }

  handleInputPageKeyDown = evt => {
    if (evt.keyCode === 13) {
      this.inputRef.current.blur()
    }
  }

  handleInputPageFocus = () => {
    this.setState({
      isInputPageFocused: true,
      keepToolbarDisplayed: true
    })
  }

  handleInputPageBlur = () => {
    this.setState(state => ({
      keepToolbarDisplayed: false,
      isInputPageFocused: false,
      inputPageValue: state.inputPageValue
        ? state.inputPageValue
        : state.currentPage,
      currentPage: state.inputPageValue
        ? parseInt(state.inputPageValue, 10)
        : state.currentPage
    }))
  }

  render() {
    const { url, file, renderFallbackExtraContent, t } = this.props
    const {
      loaded,
      errored,
      totalPages,
      currentPage,
      inputPageValue,
      scale,
      width,
      renderAllPages,
      toolbarDisplayed,
      keepToolbarDisplayed,
      isInputPageFocused
    } = this.state

    if (errored)
      return (
        <NoViewer
          file={file}
          renderFallbackExtraContent={renderFallbackExtraContent}
        />
      )

    const pageWidth = width && totalPages > 1 ? width - 15 : width // Remove the scrollbar width to avoid a horizontal scrollbar
    const pageInputValue =
      inputPageValue || inputPageValue === ''
        ? inputPageValue
        : currentPage.toString()

    return (
      <div
        className={styles['viewer-pdfviewer']}
        ref={ref => (this.wrapper = ref)}
        data-testid="pdfjs-viewer"
      >
        <Document
          file={url}
          onLoadSuccess={this.onLoadSuccess}
          onLoadError={this.onLoadError}
          className={styles['viewer-pdfviewer-pdf']}
          loading={<ViewerSpinner />}
        >
          {renderAllPages ? (
            [...Array(totalPages)].map((_, page) => (
              <Page
                key={page}
                pageNumber={page + 1}
                width={pageWidth}
                scale={scale}
                renderAnnotations={false}
                className={cx('u-mv-1', styles['viewer-pdfviewer-page'])}
              />
            ))
          ) : (
            <Page
              pageNumber={currentPage}
              width={pageWidth}
              scale={scale}
              renderAnnotations={false}
              className={styles['viewer-pdfviewer-page']}
            />
          )}
        </Document>
        {loaded && (
          <div
            className={cx(styles['viewer-pdfviewer-toolbar'], 'u-p-half', {
              [styles['viewer-pdfviewer-toolbar--hidden']]:
                !toolbarDisplayed && !keepToolbarDisplayed
            })}
            onMouseEnter={() =>
              !isInputPageFocused &&
              this.setState({ keepToolbarDisplayed: true })
            }
            onMouseLeave={() =>
              !isInputPageFocused &&
              this.setState({ keepToolbarDisplayed: false })
            }
          >
            {!renderAllPages && (
              <span className="u-mh-half">
                <ToolbarButton
                  icon="top"
                  onClick={this.previousPage}
                  disabled={currentPage === 1}
                  label={t('Viewer.previous')}
                />
                <label htmlFor="input-page">
                  <input
                    ref={this.inputRef}
                    id="input-page"
                    className={styles['viewer-pdfviewer-input-page']}
                    type="text"
                    inputMode="numeric"
                    style={makeInputPageStyle(totalPages)}
                    value={pageInputValue}
                    onChange={this.handleInputPageChange}
                    onKeyDown={this.handleInputPageKeyDown}
                    onFocus={this.handleInputPageFocus}
                    onBlur={this.handleInputPageBlur}
                  />
                  /{totalPages}
                </label>
                <ToolbarButton
                  icon="bottom"
                  onClick={this.nextPage}
                  disabled={currentPage === totalPages}
                  label={t('Viewer.next')}
                />
              </span>
            )}

            <span className="u-mh-half">
              <ToolbarButton
                icon="dash"
                onClick={this.scaleDown}
                disabled={scale === MIN_SCALE}
                label={t('Viewer.scaledown')}
              />
              <ToolbarButton
                icon="plus"
                onClick={this.scaleUp}
                disabled={scale === MAX_SCALE}
                label={t('Viewer.scaleup')}
              />
            </span>
          </div>
        )}
      </div>
    )
  }
}

PdfJsViewer.propTypes = {
  url: PropTypes.string.isRequired,
  gestures: PropTypes.object,
  renderFallbackExtraContent: PropTypes.func
}

export default flow(withFileUrl, withViewerLocales)(PdfJsViewer)
