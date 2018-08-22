class Request {
  constructor(cozyClient) {
    this.client = cozyClient.client
  }

  get(id) {
    return this.client.fetchJSON('GET', `/intents/${id}`)
  }

  post(action, type, data, permissions) {
    return this.client.fetchJSON('POST', '/intents', {
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
