/** Supports cozy-client-js and cozy-client */
export const register = (client, url) => {
  if (client.register) {
    return client.register(url)
  } else {
    return client.stackClient.register(url)
  }
}

export const getURL = client => {
  return client.stackClient
    ? client.stackClient.uri
    : client._url || client.options.uri
}
