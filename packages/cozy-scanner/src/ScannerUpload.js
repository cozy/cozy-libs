import { CozyFile } from 'cozy-doctypes'

/**
 * //!TODO this method sould be extracted to Cozy-Client itself
 * @param {String} imageURI path to access to image (file://)
 * @param {Object} qualification attached to the file
 * @param {String} name of the file you want to upload
 * @param {String} dirId to upload to file to
 * @param {String} onConflict erase / rename
 * @param {String} contentType Content-Type of the file
 */
export const doUpload = async (
  imageURI,
  qualification,
  name = '',
  dirId,
  onConflict,
  contentType
) => {
  /** Cordova plugin doesn't support promise since there are supporting Android 4.X.X
   * so we have to create manually a promise to be able to write beautiful code ;)
   */
  const p = new Promise((resolve, reject) => {
    const onResolvedLocalFS = async fileEntry => {
      fileEntry.file(
        async file => {
          const reader = new FileReader()
          reader.onloadend = async () => {
            //we get the result of the readAsBuffer in the `result` attr
            try {
              const newFile = await CozyFile.uploadFileWithConflictStrategy(
                name,
                reader.result,
                dirId,
                onConflict,
                qualification,
                contentType
              )
              resolve(newFile)
            } catch (error) {
              console.log('error', error) //eslint-disable-line no-console
              reject(error)
            }
          }
          // Read the file as an ArrayBuffer
          reader.readAsArrayBuffer(file)
        },
        err => {
          //Since this module is pretty recent, let's have this info in sentry if needed
          console.error('error getting fileentry file!' + err) //eslint-disable-line no-console
          reject(err)
        }
      )
    }

    const onError = error => {
      reject(error)
    }
    /**
     * file:/// can not be converted to a fileEntry without the Cordova's File plugin.
     * `resolveLocalFileSystemURL` is provided by this plugin and can resolve the native
     * path to a fileEntry readable by a `FileReader`
     *
     * When we finished to read the fileEntry as buffer, we start the upload process
     *
     */

    window.resolveLocalFileSystemURL(imageURI, onResolvedLocalFS, onError)
  })
  return p
}
