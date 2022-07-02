/**
 * Get type of links to display the thumbnail
 * @param {IOCozyFile} doc - An io.cozy.files document
 * @returns {'small'|'icon'}
 */
export const getLinksType = doc => {
  const isImage = doc.class === 'image'
  const isPdf = doc.class === 'pdf'
  return isImage ? 'small' : isPdf ? 'icon' : undefined
}
