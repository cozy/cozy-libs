import isEqual from 'lodash/isEqual'
import { Server } from 'mock-socket'

jest.useFakeTimers()

export class ServerMock extends Server {
  constructor(...args) {
    super(...args)

    this.messages = []

    this.on('connection', socket => {
      this.socket = socket
      this.socket.on('message', data => {
        this.messages.push(JSON.parse(data))
      })
    })
  }

  received(messageData) {
    return !!this.messages.find(message => isEqual(message, messageData))
  }

  stepForward() {
    jest.runAllTimers()
  }

  sendDoc(doc, event) {
    this.stepForward()
    return (
      this.socket &&
      this.socket.send(
        JSON.stringify({
          event,
          payload: {
            id: doc.id,
            type: doc.type,
            doc
          }
        })
      )
    )
  }
}

export default ServerMock
