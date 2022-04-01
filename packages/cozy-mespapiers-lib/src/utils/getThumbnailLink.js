/**
 * @param {CozyClient} client - CozyClient instance
 * @param {IOCozyFile} file - An io.cozy.files document
 * @returns {Promise<String>} - URL of file thumbnail
 */
export const getThumbnailLink = (client, file) => {
  const { uri } = client.getStackClient()
  let url = null

  // Check if file has links attribute (If the file comes from real time, it is missing)
  if (file.links) {
    switch (file.class) {
      case 'image':
        url = `${uri}${file.links.small}`
        break
      case 'pdf':
        url = `${uri}${file.links.icon}`
        break
      default:
        url = null
        break
    }
  }

  return url
}
