class Request {
  constructor(cozyClient) {
    this.stackClient = cozyClient.stackClient
  }

  get(id) {
    return this.stackClient
      .fetchJSON('GET', `/intents/${id}`)
      .then(resp => resp.data)
  }

  post(action, type, data, permissions) {
    return this.stackClient
      .fetchJSON('POST', '/intents', {
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
      .then(resp => resp.data)
  }
}

export default Request
