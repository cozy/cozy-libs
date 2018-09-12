import Intents from './intents'
import { mockAPI, sleep } from './testUtils'

describe('Interapp', () => {
  let client,
    intents,
    api = mockAPI()

  beforeEach(() => {
    api.reset()
  })

  const pickFileIntentNoService = {
    attributes: {
      services: []
    }
  }

  const serviceOrigin = 'http://service-mock'
  const serviceURL = 'http://service-mock/custom-service'

  const pickFileIntent = {
    id: 'pickfile-intent-id',
    meta: {
      _rev: undefined,
    },
    attributes: {
      action: 'PICK',
      type: 'io.cozy.files',
      permissions: ['GET'],
      services: [
        {
          slug: 'files',
          href: serviceURL
        }
      ]
    }
  }

  beforeEach(() => {
    client = {
      client: {
        fetchJSON: jest.fn()
      }
    }
    intents = new Intents({ client })
    client.client.fetchJSON.mockImplementation(api.fetch)
  })

  it('should initialise with cozy client', () => {
    expect(intents.request.client).toEqual(client.client)
  })

  describe('creation', () => {
    it('should resolve with created intent', async () => {
      api.respond(
        'POST',
        '/intents',
        {
          data: pickFileIntent
        },
        body => body.data.attributes.action === 'EDIT'
      )
      const intent = await intents.create('EDIT', 'io.cozy.files')
      expect(intent).toBe(pickFileIntent)
    })
  })

  describe('unexisting service', () => {
    it('should reject if no service found', async () => {
      api.respond(
        'POST',
        '/intents',
        {
          data: pickFileIntentNoService
        },
        body => body.data.attributes.action === 'EDIT'
      )
      const element = document.createElement('div')
      expect(
        intents.create('EDIT', 'io.cozy.files').start(element)
      ).rejects.toThrow('Unable to find a service')
    })
  })

  describe('existing service', () => {
    let intent, element, iframe, prom

    const mkMessage = (type, data, _intent = intent) => {
      const ev = new Event('message')
      Object.assign(ev, {
        data: {
          type: `intent-${_intent.id}:${type}`,
          ...data
        },
        origin: serviceOrigin,
        source: window
      })
      return ev
    }

    beforeEach(async () => {
      api.respond(
        'POST',
        '/intents',
        {
          data: pickFileIntent
        },
        body => body.data.attributes.action === 'EDIT'
      )
      element = document.createElement('div')
      const promIntent = intents.create('EDIT', 'io.cozy.files', {
        id: 'fileId'
      })
      intent = await promIntent
      prom = promIntent.start(element)
      await sleep(1)
      iframe = element.querySelector('iframe')
      iframe.postMessage = jest.fn()
    })

    afterEach(() => {
      prom.stop()
      jest.restoreAllMocks()
    })

    it('should have created an iframe', () => {
      expect(iframe).not.toBeUndefined()
      expect(iframe.getAttribute('src')).toBe(serviceURL)
      expect(iframe.classList.contains('coz-intent')).toBe(true)
    })

    it('cannot handle message without handshake', async () => {
      window.dispatchEvent(mkMessage('done', { document: 'hello' }))
      expect(prom).rejects.toThrow(
        'Unexpected handshake message from intent service'
      )
    })

    describe('after handshake', () => {
      beforeEach(() => {
        jest.spyOn(window, 'postMessage')
        window.dispatchEvent(mkMessage('ready', {}))
      })

      it('handles ready message', () => {
        expect(window.postMessage).toHaveBeenCalledWith(
          { id: 'fileId' },
          serviceOrigin
        )
      })

      it('handles error message from service', () => {
        window.dispatchEvent(
          mkMessage('error', {
            error: {
              message: 'Error from service',
              type: 'serviceError',
              status: 409
            }
          })
        )
        expect(prom).rejects.toMatchObject({
          message: 'Error from service',
          type: 'serviceError',
          status: 409
        })
      })

      it('handles error message from handling message', async () => {
        jest.spyOn(console, 'warn').mockReturnValue(null)
        const msg = mkMessage('ready', {})
        msg.data.type = 'intent-fakeid:ready'
        window.dispatchEvent(msg)
        await expect(prom).rejects.toThrow('Invalid event id')
      })

      it('handles resize message from service', () => {
        window.dispatchEvent(
          mkMessage('resize', {
            dimensions: {
              height: 100,
              width: 200
            },
            transition: '1s ease height'
          })
        )
        expect(element.style.width).toBe('200px')
        expect(element.style.height).toBe('100px')
        expect(element.style.transition).toBe('1s ease height')
      })
    })
  })
})
