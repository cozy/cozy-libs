class Request {
  constructor(cozyFetchJSON) {
    this.cozyFetchJSON = cozyFetchJSON
  }

  get(id) {
    return this.cozyFetchJSON('GET', `/intents/${id}`)
  }

  post(action, type, data, permissions) {
    return this.cozyFetchJSON('POST', '/intents', {
      data: {
        type: 'io.cozy.intents',
        attributes: {
          action: action,
          type: type,
          data: data,
          permissions: permissions
        }
      }
    })
  }
}

export default Request
