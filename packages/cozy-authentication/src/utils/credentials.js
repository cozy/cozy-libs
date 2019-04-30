import localforage from 'localforage'

const KEY = 'credentials'

// TODO move all this to cozy-client, maybe in the form of a plugin
// ReconnectionPlugin
const saveFromClient = async client => {
  const { uri, oauthOptions, token } = client.stackClient
  await localforage.setItem(KEY, { uri, oauthOptions, token })
}

const get = async () => {
  const saved = await localforage.getItem(KEY)
  if (!saved) {
    return
  } else {
    return saved
  }
}

const clear = async () => {
  await localforage.removeItem(KEY)
}

export default {
  saveFromClient,
  get,
  clear
}
