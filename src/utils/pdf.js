/**
 * @param {File} file
 * @returns {Promise<ArrayBuffer>}
 */
export const fileToArrayBuffer = async file => {
  if ('arrayBuffer' in file) return await file.arrayBuffer()

  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onerror = reject
    reader.onload = e => resolve(new Uint8Array(e.target.result))
    reader.readAsArrayBuffer(file)
  })
}
