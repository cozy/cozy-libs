import PropTypes from 'prop-types'
import React from 'react'

import { withClient } from 'cozy-client'
import { isAndroidApp } from 'cozy-device-helper'
import { CozyFile } from 'cozy-doctypes'
import Overlay from 'cozy-ui/transpiled/react/deprecated/Overlay'
import withOffline from 'cozy-ui/transpiled/react/helpers/withOffline'

import { ModalScannerQualification } from './'
import { doUpload } from './ScannerUpload'

export const SCANNER_IDLE = 'idle'
export const SCANNER_DONE = 'done'
export const SCANNER_UPLOADING = 'uploading'
/**
 *
 * Scanner component provides a render props with mainly a
 * `startScanner` action that opens the native camera to take
 * a photo and handle the call to the success or the faillure
 * of this action.
 *
 * If the previous action is successfull then the component will
 * display our ModalScannerQualification to describre the taken
 * document
 *
 * A LoadingScreen is used to create a better transition between
 * the native camera and the ModalScannerQualification since we
 * have a delay caused by the fact the camera is writting the
 * file on the FS.
 *
 */
class Scanner extends React.Component {
  state = {
    status: SCANNER_IDLE,
    error: null,
    filename: '',
    shouldShowScannerQualification: false,
    imageURI: '',
    loadingScreen: false
  }
  constructor(props) {
    super(props)
    if (!CozyFile.cozyClient) CozyFile.registerClient(this.props.client)
  }

  /**
   * @param {String} imageURI native path to the file (file:///var....)
   */
  onSuccess = async imageURI => {
    this.setState({
      error: null,
      loadingScreen: false,
      shouldShowScannerQualification: true,
      imageURI
    })
  }
  /**
   * @param {String} message
   */
  onFail = message => {
    this.setState({ loadingScreen: false })
    console.log('failed', message) // eslint-disable-line no-console
  }

  onUpload = async (imageURI, qualification, filename = '') => {
    const { generateName } = this.props
    const name = filename === '' ? generateName() : filename
    this.setState({ status: SCANNER_UPLOADING, filename: name })
    const { dirId, onConflict, onBeforeUpload, onFinish } = this.props
    if (onBeforeUpload) onBeforeUpload()
    try {
      const { data: uploadedFile } = await doUpload(
        imageURI,
        qualification,
        name,
        dirId,
        onConflict
      )
      this.setState({ filename: uploadedFile.name })
      if (onFinish) onFinish()
    } catch (error) {
      this.setState({ error })
    } finally {
      this.setState({ status: SCANNER_DONE })
    }
  }

  startScanner = () => {
    try {
      this.setState({ loadingScreen: true })
      // We have a bug in Android since we target API 29+
      // Same as reported in https://github.com/apache/cordova-plugin-camera/issues/587
      // So we use a different config as a workaround
      this.defaultPluginConfig = {
        quality: isAndroidApp() ? 100 : 80,
        destinationType: window.navigator.camera.DestinationType.FILE_URI,
        sourceTypes: window.navigator.camera.PictureSourceType.CAMERA,
        correctOrientation: isAndroidApp() ? false : true,
        saveToPhotoAlbum: false
      }
      window.navigator.camera.getPicture(this.onSuccess, this.onFail, {
        ...this.defaultPluginConfig,
        ...this.props.pluginConfig
      })
    } catch (e) {
      console.error('You have to install cordova camera plugin', e) // eslint-disable-line no-console
    }
  }

  onClear = () => {
    this.setState({ filename: undefined })
  }
  /**
   * Si pas de dirId => FilePicker
   */
  render() {
    const { children, isOffline } = this.props
    const {
      status,
      error,
      filename,
      shouldShowScannerQualification,
      imageURI,
      loadingScreen
    } = this.state
    if (loadingScreen) {
      return <Overlay className="u-bg-black u-mih-100" />
    }
    if (shouldShowScannerQualification)
      return (
        <ModalScannerQualification
          onSave={async (qualification, filename) => {
            this.setState({ shouldShowScannerQualification: false })
            return await this.onUpload(imageURI, qualification, filename)
          }}
          dismissAction={() => {
            window.navigator.camera.cleanup(
              () => {},
              () => {}
            )
            this.setState({ shouldShowScannerQualification: false })
          }}
        />
      )
    return (
      <>
        {children({
          error,
          status,
          filename,
          startScanner: this.startScanner,
          onClear: this.onClear,
          online: !isOffline
        })}
      </>
    )
  }
}

Scanner.defaultProps = {
  pluginConfig: {}
}

Scanner.propTypes = {
  isOffline: PropTypes.bool.isRequired
}
export default withOffline(withClient(Scanner))
