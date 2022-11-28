import EventEmitter from 'events'
import ConnectionFlow from './ConnectionFlow'
import cronHelpers from 'helpers/cron'
import { saveAccount } from '../connections/accounts'
import {
  createTrigger,
  ensureTrigger,
  fetchTrigger,
  prepareTriggerAccount,
  launchTrigger
} from '../connections/triggers'
import KonnectorJobWatcher, {
  watchKonnectorJob
} from './konnector/KonnectorJobWatcher'
import { konnectorPolicy as biKonnectorPolicy } from '../services/budget-insight'
import fixtures from '../../test/fixtures'
import sentryHub from '../sentry'
import { Q } from 'cozy-client'
import { KonnectorJobError } from '../helpers/konnectors'
import { ERRORED, EXPECTING_TRIGGER_LAUNCH } from './flowEvents'

jest.mock('./konnector/KonnectorJobWatcher')
jest.mock('../sentry', () => {
  const mockScope = {
    setTag: jest.fn()
  }
  return {
    withScope: cb => cb(mockScope),
    captureException: jest.fn()
  }
})

jest.mock('../connections/files', () => ({
  statDirectoryByPath: jest.fn(),
  createDirectoryByPath: jest.fn()
}))

jest.mock('../services/budget-insight', () => {
  const originalBudgetInsight = jest.requireActual('../services/budget-insight')
  return {
    konnectorPolicy: {
      ...originalBudgetInsight.konnectorPolicy,
      onAccountCreation: jest.fn()
    }
  }
})

KonnectorJobWatcher.prototype.watch = jest.fn()

jest.mock('date-fns')
const realtimeMock = {
  clear: () => {
    for (const [key] of realtimeMock.subscribtions) {
      const [doctype, action] = key.split(':')
      realtimeMock.unsubscribe(action, doctype)
    }
  },
  events: new EventEmitter(),
  key: (action, doctype) => `${doctype}:${action}`,
  subscribtions: new Map(),
  subscribe: jest.fn().mockImplementation((action, doctype, id, callback) => {
    const finalcallback = callback === undefined ? id : callback
    const { events, key, subscribtions } = realtimeMock
    const subscribtionKey = key(action, doctype)
    subscribtions.set(subscribtionKey, data => finalcallback(data))
    events.on(
      subscribtionKey,
      realtimeMock.subscribtions.get(key(action, doctype))
    )
  }),
  unsubscribe: jest.fn().mockImplementation((action, doctype) => {
    const { events, key, subscribtions } = realtimeMock
    const subscribtionKey = key(action, doctype)
    const subscribtion = subscribtions.get(subscribtionKey)
    if (subscribtion) {
      events.off(subscribtionKey, subscribtion)
      subscribtions.delete(key(action, doctype))
    }
  }),
  sendNotification: jest.fn()
}

jest.mock('../connections/accounts', () => ({
  saveAccount: jest.fn(),
  fetchReusableAccount: jest.fn()
}))

jest.mock('../connections/triggers', () => {
  return {
    createTrigger: jest.fn(),
    ensureTrigger: jest.fn(),
    prepareTriggerAccount: jest.fn(),
    launchTrigger: jest.fn(),
    fetchTrigger: jest.fn()
  }
})

beforeEach(() => {
  createTrigger.mockClear()
  ensureTrigger.mockClear()
  prepareTriggerAccount.mockClear()
  launchTrigger.mockClear()
})
afterEach(() => {
  realtimeMock.clear()
})

createTrigger.mockImplementation(async () => fixtures.createdTrigger)
ensureTrigger.mockImplementation(async () => fixtures.createdTrigger)
prepareTriggerAccount.mockImplementation(async () => fixtures.createdAccount)
launchTrigger.mockImplementation(async () => fixtures.launchedJob)

saveAccount.mockImplementation(async (client, konnector, account) => {
  const { _id } = account
  return _id ? fixtures.updatedAccount : fixtures.createdAccount
})

const mockVaultClient = {
  createNewCipher: jest.fn(),
  saveCipher: jest.fn(),
  getByIdOrSearch: jest.fn(),
  decrypt: jest.fn(),
  createNewCozySharedCipher: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
  getAllDecrypted: jest.fn(),
  shareWithCozy: jest.fn(),
  isLocked: jest.fn().mockResolvedValue(false)
}

const setup = ({ trigger } = {}) => {
  const client = {
    query: jest.fn(),
    collection: jest.fn().mockReturnValue({
      all: jest.fn().mockReturnValue({
        data: []
      })
    })
  }
  client.plugins = {
    realtime: realtimeMock
  }
  const flow = new ConnectionFlow(client, trigger, fixtures.konnector)
  return { flow, client }
}

const setupSubmit = (flow, submitOptions) => {
  return flow.handleFormSubmit({
    vaultClient: mockVaultClient,
    konnector: fixtures.konnector,
    userCredentials: fixtures.credentials,
    ...submitOptions
  })
}

describe('ConnectionFlow', () => {
  describe('constructor', () => {
    beforeAll(() => {
      watchKonnectorJob.mockReturnValue({ on: () => ({}) })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should watch a running trigger', () => {
      setup({ trigger: fixtures.runningTrigger })
      expect(watchKonnectorJob).toHaveBeenCalledWith(
        expect.any(Object),
        { _id: 'running-job-id' },
        { autoSuccessTimer: false }
      )
    })

    it('should watch all jobs related to the current trigger', async () => {
      setup({ trigger: fixtures.createdTrigger })
      expect(fetchTrigger).not.toHaveBeenCalled()
      realtimeMock.events.emit(realtimeMock.key('updated', 'io.cozy.jobs'), {
        ...fixtures.runningJob,
        trigger_id: 'created-trigger-id'
      })
      await new Promise(process.nextTick) // await all promises to be resolved
      expect(fetchTrigger).toHaveBeenLastCalledWith(
        expect.anything(),
        'created-trigger-id'
      )
    })

    it('should watch watch future jobs for a trigger if new fetched trigger is running', async () => {
      const { flow } = setup({ trigger: fixtures.createdTrigger })
      expect(fetchTrigger).not.toHaveBeenCalled()
      fetchTrigger.mockResolvedValueOnce(fixtures.runningTrigger)
      expect(flow.job).toBeUndefined()
      realtimeMock.events.emit(realtimeMock.key('updated', 'io.cozy.jobs'), {
        ...fixtures.runningJob,
        trigger_id: 'created-trigger-id'
      })
      await new Promise(process.nextTick) // await all promises to be resolved
      expect(fetchTrigger).toHaveBeenCalledTimes(1)
      expect(flow.job).toStrictEqual({
        _id: 'running-job-id'
      })
    })
  })

  describe('getState', () => {
    beforeAll(() => {
      watchKonnectorJob.mockReturnValue({ on: () => ({}) })
    })
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should return error if not running', () => {
      const { flow } = setup({ trigger: fixtures.erroredTrigger })
      const { error } = flow.getState()

      expect(error).toEqual(new KonnectorJobError('last error message'))
    })

    it('should not return error while running', () => {
      const { flow } = setup({ trigger: fixtures.runningTrigger })
      flow.setState({ accountError: 'error to hide' })
      const { error } = flow.getState()
      expect(error).toBe(false)
    })

    it('should not return error while expecting a trigger launch', () => {
      const { flow } = setup({ trigger: fixtures.erroredTrigger })
      flow.setState({ status: EXPECTING_TRIGGER_LAUNCH })
      const { error } = flow.getState()
      expect(error).toBe(false)
    })

    it('should return expectingTriggerLaunch while expecting a trigger launch', () => {
      const { flow } = setup({ trigger: fixtures.erroredTrigger })
      flow.setState({ status: EXPECTING_TRIGGER_LAUNCH })
      const { expectingTriggerLaunch } = flow.getState()
      expect(expectingTriggerLaunch).toBe(true)
    })

    it('should not return expectingTriggerLaunch if not expecting a trigger launch', () => {
      const { flow } = setup({ trigger: fixtures.erroredTrigger })
      flow.setState({ status: ERRORED })
      const { expectingTriggerLaunch } = flow.getState()
      expect(expectingTriggerLaunch).toBe(false)
    })
  })

  describe('handleFormSubmit', () => {
    const isSubmitting = flow => {
      return flow.getState().running === true
    }
    beforeAll(() => {
      watchKonnectorJob.mockReturnValue({ on: () => ({}) })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should render as submitting when there is no account', async () => {
      const { flow } = setup()
      const submitPromise = setupSubmit(flow)
      expect(isSubmitting(flow)).toBe(true)
      await submitPromise
    })

    it('should render as submitting when there is an account', async () => {
      const { flow } = setup()
      const submitPromise = setupSubmit(flow)
      expect(isSubmitting(flow)).toBe(true)
      await submitPromise
    })

    it('should stop being rendered as submitting on error', async () => {
      const { flow } = setup()
      const originalError = new Error()
      mockVaultClient.isLocked.mockReset().mockImplementationOnce(() => {
        const wrapped = new Error('fakeerror')
        wrapped.original = originalError
        throw wrapped
      })

      try {
        await setupSubmit(flow)
        expect(mockVaultClient.isLocked).toHaveBeenCalledTimes(1)
      } catch (e) {
        // eslint-disable-next-line no-empty
      }
      expect(sentryHub.captureException).toHaveBeenCalledWith(originalError)
      expect(isSubmitting(flow)).toBe(false)
    })

    it('should call saveAccount without account', async () => {
      const { flow, client } = setup()
      await setupSubmit(flow)
      expect(saveAccount).toHaveBeenLastCalledWith(
        client,
        fixtures.konnector,
        expect.objectContaining(fixtures.account)
      )
    })

    it('should call saveAccount with account (no password provided)', async () => {
      const { flow, client } = setup()

      mockVaultClient.decrypt.mockResolvedValueOnce({
        login: {
          username: 'username',
          password: 'password'
        }
      })

      await setupSubmit(flow, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        userCredentials: { username: 'foo' }
      })
      expect(saveAccount).toHaveBeenCalledWith(
        client,
        flow.konnector,
        expect.objectContaining(fixtures.existingAccount)
      )
    })

    it('should call saveAccount with account with RESET_SESSION state if passphrase changed', async () => {
      const { flow, client } = setup()

      await setupSubmit(flow, {
        userCredentials: {
          username: 'username',
          password: 'password'
        },
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger
      })
      expect(saveAccount).toHaveBeenCalledWith(
        client,
        flow.konnector,
        expect.objectContaining({ state: 'RESET_SESSION' })
      )
    })

    it('should call saveAccount with account with RESET_SESSION state if password changed', async () => {
      const { flow } = setup()
      mockVaultClient.decrypt.mockResolvedValueOnce({
        login: {
          username: 'username',
          password: 'password'
        }
      })

      await setupSubmit(flow, {
        userCredentials: {
          login: 'foo',
          password: 'bar'
        },
        account: {
          login: 'old',
          password: 'old'
        }
      })

      expect(saveAccount).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        expect.objectContaining({ state: 'RESET_SESSION' })
      )
    })

    it('should call ensureTriggerAndLaunch with account', async () => {
      const { flow, client } = setup()
      jest
        .spyOn(flow, 'ensureTriggerAndLaunch')
        .mockResolvedValue(fixtures.launchedJob)

      await setupSubmit(flow, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        userCredentials: fixtures.credentials
      })

      expect(flow.ensureTriggerAndLaunch).toHaveBeenCalledWith(
        client,
        expect.objectContaining({ account: fixtures.updatedAccount })
      )
    })

    it('should call ensureTriggerAndLaunch without account', async () => {
      const { flow, client } = setup()
      jest
        .spyOn(flow, 'ensureTriggerAndLaunch')
        .mockResolvedValue(fixtures.launchedJob)

      await setupSubmit(flow, {
        userCredentials: fixtures.credentials
      })

      expect(flow.ensureTriggerAndLaunch).toHaveBeenCalledWith(
        client,
        expect.objectContaining({ account: fixtures.createdAccount })
      )
    })

    describe('custom konnector policy', () => {
      const bankingKonnector = {
        ...fixtures.konnector,
        partnership: {
          domain: 'budget-insight.com'
        }
      }

      const bankingAccount = {
        ...fixtures.existingAccount,
        ...fixtures.bankingKonnectorAccountAttributes
      }

      const onAccountCreationResult = {
        auth: {
          bi: {
            connId: 7
          }
        }
      }

      it('should use custom konnector policy', async () => {
        saveAccount.mockReset().mockImplementation((konnector, acc) => ({
          ...acc,
          _id: fixtures.updatedAccount._id
        }))

        biKonnectorPolicy.onAccountCreation
          .mockReset()
          .mockReturnValue(onAccountCreationResult)

        const { flow, client } = setup()

        jest
          .spyOn(flow, 'ensureTriggerAndLaunch')
          .mockResolvedValue(fixtures.launchedJob)

        await setupSubmit(flow, {
          konnector: bankingKonnector,
          account: bankingAccount,
          userCredentials: fixtures.bankingKonnectorAccountAttributes.auth
        })

        expect(biKonnectorPolicy.onAccountCreation).toHaveBeenCalledTimes(1)
        expect(flow.ensureTriggerAndLaunch).toHaveBeenCalledTimes(1)
        expect(saveAccount).toHaveBeenCalledWith(
          client,
          flow.konnector,
          onAccountCreationResult
        )
      })
    })
  })

  describe('ensureTriggerAndLaunch', () => {
    beforeAll(() => {
      jest.spyOn(cronHelpers, 'fromFrequency').mockReturnValue('0 0 0 * * 0')
      watchKonnectorJob.mockReturnValue({ on: () => ({}) })
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should launch trigger without account', async () => {
      const { flow, client } = setup()
      await flow.ensureTriggerAndLaunch(client, {
        trigger: fixtures.createdTrigger,
        konnector: fixtures.konnector
      })
      expect(launchTrigger).toHaveBeenCalledTimes(1)
      expect(launchTrigger).toHaveBeenCalledWith(
        client,
        fixtures.createdTrigger
      )
    })

    it('should launch trigger with account', async () => {
      const { flow, client } = setup()
      ensureTrigger.mockResolvedValue(fixtures.existingTrigger)
      await flow.ensureTriggerAndLaunch(client, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        konnector: fixtures.konnector
      })
      expect(launchTrigger).toHaveBeenCalledTimes(1)
      expect(launchTrigger).toHaveBeenCalledWith(client, {
        ...fixtures.existingTrigger
      })
    })

    it('should keep internal trigger up-to-date', async () => {
      const { flow, client } = setup()
      const trigger = { ...fixtures.existingTrigger }
      ensureTrigger.mockResolvedValue(trigger)
      await flow.ensureTriggerAndLaunch(client, {
        account: fixtures.createdAccount,
        konnector: fixtures.konnector
      })
      expect(ensureTrigger).toHaveBeenCalledTimes(1)
      expect(ensureTrigger).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          trigger: undefined
        })
      )
      expect(flow.trigger).toBe(trigger)
    })

    it('should not create trigger when one is passed as prop', async () => {
      const { flow, client } = setup()
      await flow.ensureTriggerAndLaunch(client, {
        trigger: fixtures.existingTrigger,
        account: fixtures.updatedAccount,
        konnector: fixtures.konnector
      })
      expect(ensureTrigger).toHaveBeenCalledWith(
        client,
        expect.objectContaining({
          trigger: fixtures.existingTrigger
        })
      )
    })

    it('should keep updated account in state', async () => {
      const { flow, client } = setup()
      prepareTriggerAccount.mockResolvedValue(fixtures.updatedAccount)
      await flow.ensureTriggerAndLaunch(client, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        konnector: fixtures.konnector
      })
      expect(flow.account).toEqual(fixtures.updatedAccount)
    })

    it('should add the defaultFolderPath to the account when needed', async () => {
      const { flow, client } = setup()
      prepareTriggerAccount.mockResolvedValue(fixtures.updatedAccount)

      ensureTrigger.mockImplementation(
        async () => fixtures.createdTriggerWithFolder.attributes
      )
      client.query.mockImplementation(async () => ({
        data: {
          path: '/default/folder/path'
        }
      }))
      await flow.ensureTriggerAndLaunch(client, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        konnector: fixtures.konnectorWithFolder
      })
      expect(flow.account).toEqual(fixtures.updatedAccount)
      expect(saveAccount).toHaveBeenCalledWith(
        client,
        fixtures.konnectorWithFolder,
        {
          ...fixtures.existingAccount,
          defaultFolderPath: '/default/folder/path'
        }
      )
      expect(client.query).toHaveBeenCalledWith(
        Q('io.cozy.files').getById(
          fixtures.createdTriggerWithFolder.attributes.message.folder_to_save
        )
      )
    })

    it('should return unmodified account trigger folder does not exist', async () => {
      const { flow, client } = setup()
      prepareTriggerAccount.mockResolvedValue(fixtures.updatedAccount)

      ensureTrigger.mockResolvedValue(
        fixtures.createdTriggerWithFolder.attributes
      )
      client.query.mockRejectedValue(new Error('404'))
      await flow.ensureTriggerAndLaunch(client, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        konnector: fixtures.konnectorWithFolder
      })
      expect(flow.account).toEqual(fixtures.updatedAccount)
      expect(saveAccount).not.toHaveBeenCalled()
      expect(client.query).toHaveBeenCalledWith(
        Q('io.cozy.files').getById(
          fixtures.createdTriggerWithFolder.attributes.message.folder_to_save
        )
      )
    })

    it('should call the launcher when needed', async () => {
      const { client } = setup()
      const flow = new ConnectionFlow(
        client,
        fixtures.existingTrigger,
        fixtures.clientKonnector
      )
      window.cozy = {
        ClientConnectorLauncher: 'react-native'
      }
      window.ReactNativeWebView = {
        postMessage: jest.fn()
      }
      ensureTrigger.mockImplementation(async () => fixtures.existingTrigger)
      prepareTriggerAccount.mockResolvedValue(fixtures.updatedAccount)

      await flow.ensureTriggerAndLaunch(client, {
        account: fixtures.existingAccount,
        trigger: fixtures.existingTrigger,
        konnector: fixtures.konnector
      })
      expect(flow.account).toEqual(fixtures.updatedAccount)
      expect(window.ReactNativeWebView.postMessage).toHaveBeenCalledWith(
        JSON.stringify({
          message: 'startLauncher',
          value: {
            connector: fixtures.clientKonnector,
            account: fixtures.updatedAccount,
            trigger: fixtures.existingTrigger,
            job: fixtures.launchedJob
          }
        })
      )
    })
    delete window.cozy
    delete window.ReactNativeWebView
  })

  describe('expectTriggerLaunch', () => {
    it('removes account errors', () => {
      const { flow } = setup({ trigger: fixtures.erroredTrigger })
      flow.setState({ accountError: 'error to hide' })

      flow.expectTriggerLaunch({ konnector: fixtures.konnector })

      const { accountError } = flow.getState()
      expect(accountError).toBe(null)
    })

    it('sets the flow status to EXPECTING_TRIGGER_LAUNCH', () => {
      const { flow } = setup({ trigger: fixtures.runningTrigger })

      flow.expectTriggerLaunch({ konnector: fixtures.konnector })

      const { status } = flow.getState()
      expect(status).toBe(EXPECTING_TRIGGER_LAUNCH)
    })

    it('starts watching for konnector jobs creation', () => {
      const { flow } = setup({ trigger: fixtures.erroredTrigger })

      flow.expectTriggerLaunch({ konnector: fixtures.konnector })

      expect(realtimeMock.subscribe).toHaveBeenCalledWith(
        'created',
        'io.cozy.jobs',
        expect.anything() // This is the subscribed callback
      )
    })

    describe(`when a job for the flow's konnector has been created`, () => {
      const konnectorJob = flow => ({
        _id: 'job-id',
        worker: 'konnector',
        message: { konnector: flow.konnector.slug }
      })

      it('stops watching for konnector jobs creation', async () => {
        const { flow } = setup({ trigger: fixtures.erroredTrigger })
        flow.expectTriggerLaunch({ konnector: fixtures.konnector })

        const job = konnectorJob(flow)
        realtimeMock.events.emit(
          realtimeMock.key('created', 'io.cozy.jobs'),
          job
        )

        expect(realtimeMock.unsubscribe).toHaveBeenCalledWith(
          'created',
          'io.cozy.jobs',
          expect.anything()
        )
      })

      it('starts watching for updates on the job itself', () => {
        const { flow } = setup({ trigger: fixtures.erroredTrigger })
        flow.expectTriggerLaunch({ konnector: fixtures.konnector })

        const watchJobSpy = jest.spyOn(flow, 'watchJob')
        try {
          const job = konnectorJob(flow)
          realtimeMock.events.emit(
            realtimeMock.key('created', 'io.cozy.jobs'),
            job
          )

          expect(flow.job).toEqual(job)
          expect(flow.watchJob).toHaveBeenCalled()
        } finally {
          watchJobSpy.mockRestore()
        }
      })
    })
  })
})
