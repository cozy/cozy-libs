import RealtimeSubscriptions from '../src/RealtimeSubscriptions'

describe('RealtimeSubscriptions', () => {
  const events = ['created', 'updated', 'deleted']
  const selectors = {
    doctype: { type: 'io.cozy.foo' },
    document: {
      type: 'io.cozy.foo',
      id: 'cdfe01ef4da64aeabb56a129b7e2639c'
    }
  }

  describe('addHandler', () => {
    it('should throw error on invalid event', () => {
      const subscriptions = new RealtimeSubscriptions()
      expect(() =>
        subscriptions.addHandler(selectors.doctype, 'added', () => {})
      ).toThrow()
    })

    it('should throw error on invalid selector', () => {
      const subscriptions = new RealtimeSubscriptions()
      expect(() =>
        subscriptions.addHandler(
          { doctype: 'io.cozy.bar' },
          'created',
          () => {}
        )
      ).toThrow()
    })

    for (let event of events) {
      it(`should add handler for '${event}' event on doctype`, () => {
        const handler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.doctype, event, handler)

        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toBeDefined()
        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toBeDefined()
        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toHaveLength(1)
        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toContain(
          handler
        )
      })

      it(`should not add handler twice for '${event}' event on doctype`, () => {
        const handler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.doctype, event, handler)
        subscriptions.addHandler(selectors.doctype, event, handler)

        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toHaveLength(1)
        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toContain(
          handler
        )
      })

      it(`should add handler for '${event}' event on document`, () => {
        const handler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.document, event, handler)

        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toBeDefined()
        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toHaveLength(1)
        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toContain(handler)
      })

      it(`should not add handler twice for '${event}' event on document`, () => {
        const handler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.document, event, handler)
        subscriptions.addHandler(selectors.document, event, handler)

        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toHaveLength(1)
        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toContain(handler)
      })
    }
  })

  describe('removeHandler', () => {
    it('should do nothing when no handler has been added', () => {
      const subscriptions = new RealtimeSubscriptions()

      expect(() =>
        subscriptions.removeHandler(selectors.doctype, 'created', jest.fn())
      ).not.toThrow()
    })

    for (let event of events) {
      it(`should remove handler for '${event}' event on doctype`, () => {
        const firstHandler = jest.fn()
        const secondHandler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.doctype, event, firstHandler)
        subscriptions.addHandler(selectors.doctype, event, secondHandler)
        subscriptions.removeHandler(selectors.doctype, event, firstHandler)

        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toHaveLength(1)
        expect(subscriptions._handlers[`io.cozy.foo\\${event}`]).toContain(
          secondHandler
        )
      })

      it(`should remove handler for '${event}' event on document`, () => {
        const firstHandler = jest.fn()
        const secondHandler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.document, event, firstHandler)
        subscriptions.addHandler(selectors.document, event, secondHandler)
        subscriptions.removeHandler(selectors.document, event, firstHandler)

        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toHaveLength(1)
        expect(
          subscriptions._handlers[
            `io.cozy.foo\\cdfe01ef4da64aeabb56a129b7e2639c\\${event}`
          ]
        ).toContain(secondHandler)
      })
    }
  })

  describe('handle', () => {
    const document = {
      type: 'io.cozy.foo',
      id: 'cdfe01ef4da64aeabb56a129b7e2639c',
      foo: 'bar'
    }

    it('should do nothing when no handler has been added', () => {
      const subscriptions = new RealtimeSubscriptions()

      expect(() =>
        subscriptions.handle(selectors.document, 'created', document)
      ).not.toThrow()
    })

    for (let event of events) {
      it(`should handle '${event}' event on doctype`, () => {
        const firstHandler = jest.fn()
        const secondHandler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.doctype, event, firstHandler)
        subscriptions.addHandler(selectors.doctype, event, secondHandler)

        subscriptions.handle(selectors.doctype, event, document)

        expect(firstHandler).toHaveBeenCalledTimes(1)
        expect(firstHandler).toHaveBeenCalledWith(document)

        expect(secondHandler).toHaveBeenCalledTimes(1)
        expect(secondHandler).toHaveBeenCalledWith(document)
      })

      it(`should handle '${event}' event on document`, () => {
        const firstHandler = jest.fn()
        const secondHandler = jest.fn()
        const subscriptions = new RealtimeSubscriptions()
        subscriptions.addHandler(selectors.doctype, event, firstHandler)
        subscriptions.addHandler(selectors.document, event, secondHandler)

        subscriptions.handle(selectors.document, event, document)

        expect(firstHandler).toHaveBeenCalledTimes(1)
        expect(firstHandler).toHaveBeenCalledWith(document)

        expect(secondHandler).toHaveBeenCalledTimes(1)
        expect(secondHandler).toHaveBeenCalledWith(document)
      })
    }
  })

  describe('toSubscribeMessages', () => {
    it('should return a list of SUBSCRIBE messages payloads', () => {
      const subscriptions = new RealtimeSubscriptions()

      subscriptions.addHandler(selectors.doctype, 'created', jest.fn())
      subscriptions.addHandler(selectors.doctype, 'deleted', jest.fn())
      subscriptions.addHandler(selectors.document, 'updated', jest.fn())
      subscriptions.addHandler(selectors.document, 'updated', jest.fn())

      expect(subscriptions.toSubscribeMessages()).toEqual([
        selectors.doctype,
        selectors.document
      ])
    })
  })
})
