import CozyClient from 'cozy-client'
import KonnectorJob from './KonnectorJob'
import cronHelpers from 'helpers/cron'
import { saveAccount } from '../connections/accounts'
import {
  createTrigger,
  ensureTrigger,
  prepareTriggerAccount,
  launchTrigger
} from '../connections/triggers'
import CozyRealtime from 'cozy-realtime'
import KonnectorJobWatcher from './konnector/KonnectorJobWatcher'
import { konnectorPolicy as biKonnectorPolicy } from '../../src/services/budget-insight'
import fixtures from '../../test/fixtures'

jest.mock('../../src/connections/files', () => ({
  statDirectoryByPath: jest.fn(),
  createDirectoryByPath: jest.fn()
}))

jest.mock('cozy-flags', () => name => {
  if (name === 'harvest.bi-konnector-policy') {
    return true
  } else {
    return false
  }
})

jest.mock('../../src/services/budget-insight', () => {
  const originalBudgetInsight = jest.requireActual(
    '../../src/services/budget-insight'
  )
  return {
    konnectorPolicy: {
      ...originalBudgetInsight.konnectorPolicy,
      onAccountCreation: jest.fn()
    }
  }
})

KonnectorJobWatcher.prototype.watch = jest.fn()

jest.mock('date-fns')
CozyRealtime.prototype.subscribe = jest.fn()
CozyRealtime.prototype.unsubscribe = jest.fn()

jest.mock('../connections/accounts', () => ({
  saveAccount: jest.fn()
}))

jest.mock('../connections/triggers', () => {
  return {
    createTrigger: jest.fn(),
    ensureTrigger: jest.fn(),
    prepareTriggerAccount: jest.fn(),
    launchTrigger: jest.fn()
  }
})

beforeEach(() => {
  createTrigger.mockClear()
  ensureTrigger.mockClear()
  prepareTriggerAccount.mockClear()
  launchTrigger.mockClear()
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
  const client = new CozyClient({})
  const flow = new KonnectorJob(client, trigger)
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

describe('KonnectorJob', () => {
  describe('handleFormSubmit', () => {
    const isSubmitting = flow => {
      return flow.getState().running === true
    }

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
      mockVaultClient.isLocked.mockReset().mockImplementationOnce(() => {
        throw new Error('fakeerror')
      })

      try {
        await setupSubmit(flow)
        expect(mockVaultClient.isLocked).toHaveBeenCalledTimes(1)
      } catch (e) {
        // eslint-disable-next-line no-empty
      }

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
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should launch trigger without account', async () => {
      const { flow, client } = setup()
      await flow.ensureTriggerAndLaunch(client, {
        trigger: fixtures.createdTrigger
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
        trigger: fixtures.existingTrigger
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
        account: fixtures.createdAccount
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
        account: fixtures.updatedAccount
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
        trigger: fixtures.existingTrigger
      })
      expect(flow.account).toEqual(fixtures.updatedAccount)
    })
  })
})

// it should have running false on trigger updates
// it should set error on trigger updates
