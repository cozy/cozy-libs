/* eslint-env jest */
import { createTrigger, launchTrigger } from 'connections/triggers'

import CozyClient from 'cozy-client'

import fixtures from '../../test/fixtures'

const setup = () => {
  const client = new CozyClient({})
  const triggerCollection = {
    create: jest.fn().mockResolvedValue({
      data: fixtures.createdTrigger
    }),
    launch: jest.fn().mockResolvedValue({
      data: fixtures.launchedJob
    })
  }

  jest.spyOn(CozyClient.prototype, 'collection').mockImplementation(() => {
    return triggerCollection
  })

  return {
    client,
    triggerCollection
  }
}

describe('Trigger mutations', () => {
  describe('createTrigger', () => {
    it('calls Cozy Client and returns trigger', async () => {
      const { client, triggerCollection } = setup()
      const result = await createTrigger(client, fixtures.trigger)
      expect(triggerCollection.create).toHaveBeenCalledWith(fixtures.trigger)
      expect(result).toEqual(fixtures.createdTrigger)
    })
  })

  describe('launchTrigger', () => {
    it('calls expected endpoint', async () => {
      const { client, triggerCollection } = setup()
      const result = await launchTrigger(client, fixtures.trigger)
      expect(triggerCollection.launch).toHaveBeenCalledWith(fixtures.trigger)
      expect(result).toEqual(fixtures.launchedJob)
    })
  })
})
