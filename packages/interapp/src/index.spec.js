/* eslint-env mocha */

// eslint-disable-next-line no-unused-vars
import should from 'should'
import sinon from 'sinon'
import { Client } from '../../src'
import mock from '../mock-api'

const serviceMockHref =
  'https://files.cozy.example.net/pick?intent=77bcc42c-0fd8-11e7-ac95-8f605f6e8338'
const composedServiceMockHref =
  'https://store.cozy.example.net/install?intent=4279db3278734467a1627fbef99a9de1'

function mockElement() {
  const windowMock = {
    postMessage: sinon.spy(),
    addEventListener: sinon.stub(),
    removeEventListener: sinon.spy()
  }
  const iframeMock = {
    setAttribute: sinon.spy(),
    src: serviceMockHref,
    parentNode: {
      removeChild: sinon.stub().returns(iframeMock)
    },
    classList: {
      add: sinon.spy()
    },
    focus: sinon.spy(),
    style: {}
  }
  const compositionIframeMock = {
    setAttribute: sinon.spy(),
    src: composedServiceMockHref,
    parentNode: {
      removeChild: sinon.stub().returns(compositionIframeMock)
    },
    classList: {
      add: sinon.spy()
    },
    focus: sinon.spy(),
    style: {}
  }
  const createElementStub = () => {
    const stub = sinon.stub()
    stub.onFirstCall().returns(iframeMock)
    stub.onSecondCall().returns(compositionIframeMock)
    return stub
  }
  const documentMock = {
    defaultView: windowMock,
    createElement: createElementStub()
  }
  const iframeWindowMock = {
    postMessage: sinon.spy()
  }
  const compositionIframeWindowMock = {
    postMessage: sinon.spy()
  }
  return {
    compositionIframeWindowMock,
    style: [],
    ownerDocument: documentMock,
    appendChild: sinon.spy(),
    compositionIframeMock,
    iframeMock: iframeMock,
    documentMock: documentMock,
    windowMock: windowMock,
    iframeWindowMock: iframeWindowMock
  }
}

describe('Intents', function() {
  const cozy = {}

  const expectedIntent = {
    _id: '77bcc42c-0fd8-11e7-ac95-8f605f6e8338',
    _rev: undefined,
    _type: 'io.cozy.intents',
    attributes: {
      action: 'PICK',
      type: 'io.cozy.files',
      permissions: ['GET'],
      client: 'contacts.cozy.example.net',
      services: [
        {
          slug: 'files',
          href: serviceMockHref
        }
      ]
    },
    links: {
      self: '/intents/77bcc42c-0fd8-11e7-ac95-8f605f6e8338',
      permissions: '/permissions/a340d5e0-d647-11e6-b66c-5fc9ce1e17c6'
    }
  }

  const serviceUrl = 'https://files.cozy.example.net'
  const compositionServiceUrl = 'https://store.cozy.example.net'

  beforeEach(() => {
    cozy.client = new Client({
      cozyURL: 'http://my.cozy.io///',
      token: 'apptoken'
    })
  })
  afterEach(() => mock.restore())

  describe('Create', function() {
    beforeEach(mock.mockAPI('CreateIntent'))

    it('should return created intent', async function() {
      return cozy.client.intents
        .create('PICK', 'io.cozy.whatever.i.am.a.mock')
        .then(intent => {
          // added by cozy-client-js
          expectedIntent.relations = intent.relations
          should.deepEqual(intent, expectedIntent)
        })
    })

    it('should throw error for malformed intents', function() {
      should.throws(
        () => cozy.client.intents.create(),
        /Misformed intent, "action" property must be provided/
      )

      should.throws(
        () => cozy.client.intents.create(null, 'io.cozy.contacts'),
        /Misformed intent, "action" property must be provided/
      )

      should.throws(
        () => cozy.client.intents.create('PICK'),
        /Misformed intent, "type" property must be provided/
      )
    })
  })

  describe('Intent.start', function() {
    beforeEach(mock.mockAPI('CreateIntent'))

    describe('Filtering', () => {
      it('should filter intents', async () => {
        cozy.client.intents
          .create('EDIT', 'io.cozy.files', {
            filterServices: x => x.slug === 'files'
          })
          .should.not.be.rejectedWith(/Unable to find a service/)
      })
      it('should filter intents', () => {
        cozy.client.intents
          .create('EDIT', 'io.cozy.files', {
            filterServices: x => x.slug === 'files2'
          })
          .should.be.rejectedWith(/Unable to find a service/)
      })
    })

    describe('No Service', function() {
      before(mock.mockAPI('CreateIntentWithNoService'))

      it('should reject with error', async function() {
        const element = mockElement()

        return cozy.client.intents
          .create('EDIT', 'io.cozy.files')
          .start(element)
          .should.be.rejectedWith(/Unable to find a service/)
      })
    })

    it('should inject iframe (not async)', function(done) {
      const element = mockElement()
      const { documentMock, iframeMock } = element

      const onReadyCallbackMock = () => {}

      cozy.client.intents
        .create('PICK', 'io.cozy.files')
        .start(element, onReadyCallbackMock)

      setTimeout(() => {
        should(
          documentMock.createElement.withArgs('iframe').calledOnce
        ).be.true()
        should(iframeMock.onload).equal(onReadyCallbackMock)
        should(
          iframeMock.setAttribute.withArgs(
            'src',
            expectedIntent.attributes.services[0].href
          ).calledOnce
        ).be.true()
        should(
          iframeMock.classList.add.withArgs('coz-intent').calledOnce
        ).be.true()
        should(element.appendChild.withArgs(iframeMock).calledOnce).be.true()
        should(iframeMock.focus.withArgs().calledOnce).be.true()
        done()
      }, 10)
    })

    it('should inject iframe (not async) also without onReadyCallback', function(done) {
      const element = mockElement()
      const { documentMock, iframeMock } = element

      cozy.client.intents.create('PICK', 'io.cozy.files').start(element)

      setTimeout(() => {
        should(
          documentMock.createElement.withArgs('iframe').calledOnce
        ).be.true()
        should(iframeMock.onload).be.undefined()
        should(
          iframeMock.setAttribute.withArgs(
            'src',
            expectedIntent.attributes.services[0].href
          ).calledOnce
        ).be.true()
        should(
          iframeMock.classList.add.withArgs('coz-intent').calledOnce
        ).be.true()
        should(element.appendChild.withArgs(iframeMock).calledOnce).be.true()
        should(iframeMock.focus.withArgs().calledOnce).be.true()
        done()
      }, 10)
    })

    it('shoud manage handshake', function(done) {
      const element = mockElement()
      const { windowMock, iframeWindowMock } = element

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:ready'
        },
        source: iframeWindowMock
      }

      cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)

      setTimeout(() => {
        should(
          windowMock.addEventListener.withArgs('message').calledOnce
        ).be.true()
        should(
          windowMock.removeEventListener.neverCalledWith('message')
        ).be.true()

        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]

        messageEventListener(handshakeEventMessageMock)
        should(
          iframeWindowMock.postMessage.calledWithMatch(
            { key: 'value' },
            serviceUrl
          )
        ).be.true()
        done()
      }, 10)
    })

    it('should manage handshake fail', async function() {
      const element = mockElement()
      const { windowMock, iframeWindowMock } = element

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: 'unexpected handshake data',
        source: iframeWindowMock
      }

      const call = cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)

      setTimeout(() => {
        should(
          windowMock.addEventListener.withArgs('message').calledOnce
        ).be.true()
        should(
          windowMock.removeEventListener.neverCalledWith('message')
        ).be.true()

        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]
        messageEventListener(handshakeEventMessageMock)

        should(
          windowMock.removeEventListener.withArgs(
            'message',
            messageEventListener
          ).calledOnce
        ).be.true()
      }, 10)

      return call.should.be.rejectedWith(
        /Unexpected handshake message from intent service/
      )
    })

    it('should handle composition', function(done) {
      const element = mockElement()
      const {
        compositionIframeMock,
        compositionIframeWindowMock,
        iframeMock,
        iframeWindowMock,
        windowMock
      } = element

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:ready'
        },
        source: iframeWindowMock
      }

      const composeEventMessageMock = {
        origin: serviceUrl,
        data: {
          action: 'INSTALL',
          data: { slug: 'myapp' },
          doctype: 'io.cozy.apps',
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:compose'
        },
        source: iframeWindowMock
      }

      const terminateCompositionEventMessageMock = {
        origin: compositionServiceUrl,
        data: {
          document: { slug: 'io.cozy.apps/myapp' },
          type: 'intent-4279db3278734467a1627fbef99a9de1:done'
        }
      }

      cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)

      setTimeout(() => {
        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]

        messageEventListener(handshakeEventMessageMock)

        mock.restore().mockAPI('CreateComposedIntent')()
        messageEventListener(composeEventMessageMock)

        setTimeout(() => {
          element.appendChild
            .withArgs(compositionIframeMock)
            .calledOnce.should.be.true()

          iframeMock.style.display.should.be.equal('none')

          const compositionMessageEventListener =
            windowMock.addEventListener.secondCall.args[1]

          should(
            windowMock.addEventListener.withArgs('message').calledTwice
          ).be.true()

          const compositionHandshakeEventMessageMock = {
            origin: compositionServiceUrl,
            data: {
              type: 'intent-4279db3278734467a1627fbef99a9de1:ready'
            },
            source: compositionIframeWindowMock
          }

          compositionMessageEventListener(compositionHandshakeEventMessageMock)
          compositionMessageEventListener(terminateCompositionEventMessageMock)

          setTimeout(() => {
            iframeMock.style.display.should.be.equal('block')

            should(
              windowMock.removeEventListener.withArgs(
                'message',
                compositionMessageEventListener
              ).calledOnce
            ).be.true()

            compositionIframeMock.parentNode.removeChild
              .withArgs(compositionIframeMock)
              .calledOnce.should.be.true()

            done()
          }, 10)
        }, 10)
      }, 10)
    })

    it('should handle intent error', async function() {
      const element = mockElement()
      const { windowMock, iframeWindowMock } = element

      const error = new Error('test error')
      error.type = 'serviceError'
      error.status = '409'

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:error',
          error: {
            message: 'test error',
            type: 'serviceError',
            status: '409'
          }
        },
        source: iframeWindowMock
      }

      const call = cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)
        .catch(error => {
          error.should.have.property('message').eql('test error')
          error.should.have.property('type').eql('serviceError')
          error.should.have.property('status').eql('409')

          throw error
        })

      setTimeout(() => {
        should(
          windowMock.addEventListener.withArgs('message').calledOnce
        ).be.true()
        should(
          windowMock.removeEventListener.neverCalledWith('message')
        ).be.true()

        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]
        messageEventListener(handshakeEventMessageMock)

        should(
          windowMock.removeEventListener.withArgs(
            'message',
            messageEventListener
          ).calledOnce
        ).be.true()
      }, 10)

      return call.should.be.rejectedWith(error)
    })

    it('should handle intent success', async function() {
      const element = mockElement()
      const { windowMock, iframeWindowMock } = element

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:ready'
        },
        source: iframeWindowMock
      }

      const result = {
        id: 'abcde1234'
      }

      const resolveEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:done',
          document: result
        },
        source: iframeWindowMock
      }

      const call = cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)

      setTimeout(() => {
        should(
          windowMock.addEventListener.withArgs('message').calledOnce
        ).be.true()
        should(
          windowMock.removeEventListener.neverCalledWith('message')
        ).be.true()

        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]

        messageEventListener(handshakeEventMessageMock)
        should(
          iframeWindowMock.postMessage.calledWithMatch(
            { key: 'value' },
            serviceUrl
          )
        ).be.true()

        messageEventListener(resolveEventMessageMock)
        should(
          windowMock.removeEventListener.withArgs(
            'message',
            messageEventListener
          ).calledOnce
        ).be.true()
      }, 10)

      return call.should.be.fulfilledWith(result)
    })

    it('should handle intent resize', async function() {
      const element = mockElement()
      const { windowMock, iframeWindowMock } = element

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:ready'
        },
        source: iframeWindowMock
      }

      const dimensions = {
        width: 400,
        height: 280
      }

      const resizeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:resize',
          dimensions,
          transition: '.2s linear'
        },
        source: iframeWindowMock
      }

      const result = {
        id: 'abcde1234'
      }

      const resolveEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:done',
          document: result
        },
        source: iframeWindowMock
      }

      const call = cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)

      setTimeout(() => {
        should(
          windowMock.addEventListener.withArgs('message').calledOnce
        ).be.true()
        should(
          windowMock.removeEventListener.neverCalledWith('message')
        ).be.true()

        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]

        messageEventListener(handshakeEventMessageMock)
        should(
          iframeWindowMock.postMessage.calledWithMatch(
            { key: 'value' },
            serviceUrl
          )
        ).be.true()

        messageEventListener(resizeEventMessageMock)
        element.style['width'].should.exist
        element.style['width'].should.equal('400px')
        element.style['height'].should.exist
        element.style['height'].should.equal('280px')
        element.style['transition'].should.exist
        element.style['transition'].should.equal('.2s linear')

        messageEventListener(resolveEventMessageMock)
        should(
          windowMock.removeEventListener.withArgs(
            'message',
            messageEventListener
          ).calledOnce
        ).be.true()
      }, 10)

      return call.should.be.fulfilledWith(result)
    })

    it('should handle intent exposeFrameRemoval', async function() {
      const element = mockElement()
      const { windowMock, iframeMock, iframeWindowMock } = element

      const handshakeEventMessageMock = {
        origin: serviceUrl,
        data: {
          type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:ready'
        },
        source: iframeWindowMock
      }

      const docMock = {
        id: 'abcde1234'
      }

      const resolveexposeFrameRemovalEventMessageMock = {
        origin: serviceUrl,
        data: {
          type:
            'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:exposeFrameRemoval',
          document: docMock
        },
        source: iframeWindowMock
      }

      const call = cozy.client.intents
        .create('PICK', 'io.cozy.files', { key: 'value' })
        .start(element)

      setTimeout(() => {
        should(
          windowMock.addEventListener.withArgs('message').calledOnce
        ).be.true()
        should(
          windowMock.removeEventListener.neverCalledWith('message')
        ).be.true()

        const messageEventListener =
          windowMock.addEventListener.firstCall.args[1]

        messageEventListener(handshakeEventMessageMock)
        should(
          iframeWindowMock.postMessage.calledWithMatch(
            { key: 'value' },
            serviceUrl
          )
        ).be.true()

        messageEventListener(resolveexposeFrameRemovalEventMessageMock)
        should(
          windowMock.removeEventListener.withArgs(
            'message',
            messageEventListener
          ).calledOnce
        ).be.true()
      }, 10)

      return call.then(result => {
        should(result.doc).equal(docMock)
        should(result.removeIntentFrame).be.Function()

        // test iframe removing by calling the returned closing method
        should(
          iframeMock.parentNode.removeChild.withArgs(iframeMock).calledOnce
        ).be.false()
        result.removeIntentFrame()
        should(
          iframeMock.parentNode.removeChild.withArgs(iframeMock).calledOnce
        ).be.true()
      })
    })
  })

  describe('CreateService', function() {
    function mockWindow(props) {
      return Object.assign(
        {
          document: {
            documentElement: {
              style: {}
            },
            body: {
              style: {}
            }
          },
          addEventListener: sinon.spy(),
          removeEventListener: sinon.spy(),
          parent: {
            postMessage: sinon.stub()
          },
          location: {
            search: 'intent=77bcc42c-0fd8-11e7-ac95-8f605f6e8338'
          }
        },
        props
      )
    }

    beforeEach(mock.mockAPI('GetIntent'))

    it('starts handshake', async function() {
      const windowMock = mockWindow()

      const clientHandshakeEventMessageMock = {
        origin: expectedIntent.attributes.client,
        data: { foo: 'bar' }
      }

      windowMock.parent.postMessage.callsFake(() => {
        const messageEventListener =
          windowMock.addEventListener.thirdCall.args[1]
        windowMock.addEventListener
          .withArgs('message', messageEventListener)
          .calledOnce.should.be.true()

        messageEventListener(clientHandshakeEventMessageMock)
        windowMock.removeEventListener
          .withArgs('message', messageEventListener)
          .calledOnce.should.be.true()
      })

      return cozy.client.intents
        .createService(expectedIntent._id, windowMock)
        .then(() => {
          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:ready'
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })
    })

    it('should manage handshake', async function() {
      const windowMock = mockWindow()

      const clientHandshakeEventMessageMock = {
        origin: expectedIntent.attributes.client,
        data: { foo: 'bar' }
      }

      windowMock.parent.postMessage.callsFake(() => {
        const messageEventListener =
          windowMock.addEventListener.thirdCall.args[1]
        windowMock.addEventListener
          .withArgs('message', messageEventListener)
          .calledOnce.should.be.true()

        messageEventListener(clientHandshakeEventMessageMock)
        windowMock.removeEventListener
          .withArgs('message', messageEventListener)
          .calledOnce.should.be.true()
      })

      return cozy.client.intents
        .createService(expectedIntent._id, windowMock)
        .then(service => {
          should(typeof service.getData === 'function').be.true()
          should(typeof service.getIntent === 'function').be.true()
          should(typeof service.terminate === 'function').be.true()
          service.getData().should.deepEqual({ foo: 'bar' })
          return true
        })
        .should.be.fulfilledWith(true)
    })

    it('should throw error when not in a browser context', () => {
      cozy.client.intents
        .createService()
        .should.be.rejectedWith(/Intent service should be used in browser/)
    })

    it('should throw error when no intent is passed in URL', () => {
      global.window = mockWindow({
        location: { search: '' }
      })

      cozy.client.intents
        .createService()
        .should.be.rejectedWith(/Cannot retrieve intent from URL/)

      delete global.window
    })

    describe('Service', function() {
      describe('ResizeClient', function() {
        it('should send provided sizes to the client without transition', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.resizeClient({
            width: 100,
            height: 200
          })

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:resize',
            dimensions: {
              width: 100,
              height: 200
            }
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should handle transition optional argument', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.resizeClient(
            {
              width: 100,
              height: 200
            },
            '.3s ease-in'
          )

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:resize',
            dimensions: {
              width: 100,
              height: 200
            },
            transition: '.3s ease-in'
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should calculate width and height from a provided dom element', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.resizeClient({
            element: {
              clientHeight: 10,
              clientWidth: 13
            }
          })

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:resize',
            dimensions: {
              maxWidth: 13,
              maxHeight: 10
            }
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should maximize the iframe document', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          return cozy.client.intents
            .createService(expectedIntent._id, windowMock)
            .then(() => {
              const loadEventListener =
                windowMock.addEventListener.firstCall.args[1]
              loadEventListener()

              windowMock.document.documentElement.style.height.should.be.equal(
                '100%'
              )
              windowMock.document.body.style.height.should.be.equal('100%')
            })
        })

        it('should not be called once the service has been terminated', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.terminate(result)

          should.throws(() => {
            service.resizeClient({
              element: {
                clientHeight: 10,
                clientWidth: 13
              }
            })
          }, /Intent service has been terminated/)
        })
      })

      describe('Compose', function() {
        it('should send compose message to Client', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.compose(
            'ACTION',
            'io.cozy.doctype',
            { key: 'value' }
          )

          const messageMatch = sinon.match({
            action: 'ACTION',
            data: { key: 'value' },
            doctype: 'io.cozy.doctype',
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:compose'
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should handle composition resolution', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          const composeResolutionMessageMock = {
            origin: expectedIntent.attributes.client,
            data: result
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          windowMock.parent.postMessage.callsFake(() => {
            const composeEventListener = windowMock.addEventListener.getCall(3)
              .args[1]
            composeEventListener(composeResolutionMessageMock)
          })

          return service
            .compose(
              'ACTION',
              'io.cozy.doctype',
              { key: 'value' }
            )
            .should.be.fulfilledWith(result)
        })
      })

      describe('Terminate', function() {
        it('should send result document to Client', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.terminate(result)

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:done',
            document: result
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should send result document to Client also with no params', async function() {
          global.window = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          window.parent.postMessage.callsFake(() => {
            const messageEventListener =
              window.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService()

          service.terminate(result)

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:done',
            document: result
          })

          window.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()

          delete global.window
        })

        it('should send removeIntentFrame method also if exposeIntentFrameRemoval flag found in data', async function() {
          global.window = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar', exposeIntentFrameRemoval: true }
          }

          const docMock = {
            type: 'io.cozy.things'
          }

          window.parent.postMessage.callsFake(() => {
            const messageEventListener =
              window.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService()

          service.terminate(docMock)

          const messageMatch = sinon.match({
            type:
              'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:exposeFrameRemoval',
            document: docMock
          })

          window.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()

          delete global.window
        })

        it('should not be called twice', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.terminate(result)

          should.throws(() => {
            service.terminate(result)
          }, /Intent service has already been terminated/)
        })
      })

      describe('Cancel', function() {
        it('should send null to Client', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.cancel()

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:cancel'
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should send null to Client also with no parameters', async function() {
          global.window = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          window.parent.postMessage.callsFake(() => {
            const messageEventListener =
              window.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            window
          )

          service.cancel()

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:cancel'
          })

          window.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()

          delete global.window
        })

        it('should not be called twice', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.cancel()

          should.throws(() => {
            service.cancel()
          }, /Intent service has already been terminated/)
        })

        it('should forbbid further calls to terminate()', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.cancel()

          should.throws(() => {
            service.terminate(result)
          }, /Intent service has already been terminated/)
        })
      })

      describe('Throw', function() {
        it('should send error to Client', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          const error = new Error('test error')
          error.type = 'testError'
          error.status = 500

          service.throw(error)

          const messageMatch = sinon.match({
            type: 'intent-77bcc42c-0fd8-11e7-ac95-8f605f6e8338:error',
            error: {
              message: 'test error',
              type: 'testError',
              status: 500
            }
          })

          windowMock.parent.postMessage
            .withArgs(messageMatch, expectedIntent.attributes.client)
            .calledOnce.should.be.true()
        })

        it('should not be called twice', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.throw(new Error('unique error'))

          should.throws(() => {
            service.cancel()
          }, /Intent service has already been terminated/)
        })

        it('should forbbid further calls to terminate()', async function() {
          const windowMock = mockWindow()

          const clientHandshakeEventMessageMock = {
            origin: expectedIntent.attributes.client,
            data: { foo: 'bar' }
          }

          const result = {
            type: 'io.cozy.things'
          }

          windowMock.parent.postMessage.callsFake(() => {
            const messageEventListener =
              windowMock.addEventListener.thirdCall.args[1]
            messageEventListener(clientHandshakeEventMessageMock)
          })

          const service = await cozy.client.intents.createService(
            expectedIntent._id,
            windowMock
          )

          service.throw(new Error('test error'))

          should.throws(() => {
            service.terminate(result)
          }, /Intent service has already been terminated/)
        })
      })
    })
  })

  describe('getRedirectionURL', () => {
    describe('to doctype', () => {
      beforeEach(mock.mockAPI('CreateIntentToRedirect'))

      it('returns expected URL for doctype', async () => {
        return cozy.client.intents
          .getRedirectionURL('io.cozy.files')
          .then(url => {
            should.equal(url, 'https://drive.cozy.example.net/#/files')
          })
      })

      it('returns expected URL for document', async () => {
        const data = {
          id: 'da20344a-e37f-440a-a98f-7efa73671b95',
          folder: 'a093723b-0e70-4050-9121-10394b53b966',
          ignoredFunction: foo => `${foo}bar`,
          ignoredObject: {
            attribute: 'value'
          },
          ignoredArray: ['value1', 'value2']
        }
        const url1 = await cozy.client.intents.getRedirectionURL(
          'io.cozy.files',
          data
        )
        should.equal(
          url1,
          'https://drive.cozy.example.net/#/files?id=da20344a-e37f-440a-a98f-7efa73671b95&folder=a093723b-0e70-4050-9121-10394b53b966'
        )
      })
    })
  })
})
