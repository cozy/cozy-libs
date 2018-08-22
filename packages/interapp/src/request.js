class Request {
  constructor(cozyClient) {
    this.client = cozyClient.client
  }

  get(id) {
    return this.client
      .fetchJSON('GET', `/intents/${id}`)
      .then(resp => resp.data)
  }

  post(action, type, data, permissions) {
    return this.client
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
