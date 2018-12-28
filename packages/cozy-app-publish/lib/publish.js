const fetch = require('node-fetch')

module.exports = async ({
  registryUrl,
  registryEditor,
  registryToken,
  spaceName,
  appSlug,
  appVersion,
  appBuildUrl,
  sha256Sum,
  appType
}) => {
  const url = `${registryUrl}/${
    spaceName ? spaceName + '/' : ''
  }registry/${appSlug}`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${registryToken}`
    },
    body: JSON.stringify({
      editor: registryEditor,
      version: appVersion,
      url: appBuildUrl,
      sha256: sha256Sum,
      type: appType
    })
  })

  if (response.status === 404) {
    const text = await response.text()
    throw new Error(text)
  } else if (response.status !== 201) {
    try {
      const body = await response.json()
      throw new Error(
        `${response.status} ${response.statusText}: ${body.error}`
      )
    } catch (e) {
      const text = await response.text()
      throw new Error(`${response.status} ${response.statusText}: ${text}`)
    }
  }

  return response
}
