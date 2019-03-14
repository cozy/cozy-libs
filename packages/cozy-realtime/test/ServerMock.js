import { Server } from 'mock-socket'

jest.useFakeTimers()

export class ServerMock extends Server {
  constructor(...args) {
    super(...args)

    /**
     * Stores the received messages as key and a counter of
     * received messages as value
     * @type {Object}
     */
    this.messages = {}

    this.on('connection', socket => {
      this.socket = socket
      this.socket.on('message', data => {
        this.messages[data] = this.messages[data] || 0
        this.messages[data]++
      })
    })
  }

  received(messageRawData) {
    return !!this.messages[messageRawData]
  }

  receivedTimes(messageRawData) {
    return this.messages[messageRawData] || 0
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
