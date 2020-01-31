/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { render } from '@testing-library/react'

import { DumbTriggerManager as TriggerManager } from 'components/TriggerManager'
import cronHelpers from 'helpers/cron'
import { konnectorPolicy as biKonnectorPolicy } from '../../src/services/budget-insight'

jest.mock('cozy-flags', () => name => {
  if (name === 'bi-konnector-policy') {
    return true
  } else {
    return false
  }
})

jest.mock('cozy-keys-lib')

jest.mock('cozy-doctypes', () => {
  const doctypes = jest.requireActual('cozy-doctypes')

  const CozyFolder = {
    copyWithClient: () => CozyFolder,
    ensureMagicFolder: () => ({ path: '/Administrative' }),
    magicFolders: {
      ADMINISTRATIVE: 'io.cozy.apps/administrative',
      PHOTOS: '/photos'
    }
  }

  return {
    ...doctypes,
    CozyFolder
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

jest.mock('cozy-ui/transpiled/react/utils/color')

const fixtures = {
  data: {
    username: 'foo',
    passphrase: 'bar'
  },
  konnector: {
    slug: 'konnectest',
    fields: {
      username: {
        type: 'text'
      },
      passphrase: {
        type: 'password'
      }
    }
  },
  konnectorWithFolder: {
    name: 'myBills',
    slug: 'mybills',
    fields: {
      advancedFields: {
        folderPath: {
          advanced: true
        }
      }
    }
  },
  folder: {
    _id: '3f5b288af36041f189ec22063adab706'
  },
  folderPath: '/Administrative/myBills/foo',
  folderPermission: {
    saveFolder: {
      type: 'io.cozy.files',
      values: ['3f5b288af36041f189ec22063adab706'],
      verbs: ['GET', 'PATCH', 'POST']
    }
  },
  triggerAttributes: {
    arguments: '0 0 0 * * 0',
    type: '@cron',
    worker: 'konnector',
    message: {
      account: 'created-account-id',
      konnector: 'konnectest'
    }
  },
  account: {
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  createdAccount: {
    _id: 'created-account-id',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  updatedAccount: {
    _id: 'updated-account-id',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'fuz'
    }
  },
  existingAccount: {
    _id: 'existing-account-id',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  existingTrigger: {
    id: 'existing-trigger-id',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'existing-account-id',
        konnector: 'konnectest'
      }
    }
  },
  bankingKonnectorAccountAttributes: {
    auth: {
      identifier: '80564789',
      secret: '13337'
    },
    identifier: '80564789'
  },
  createdTrigger: {
    id: 'created-trigger-id',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'updated-account-id',
        konnector: 'konnectest'
      }
    }
  },
  launchedJob: {
    type: 'io.cozy.jobs',
    id: 'lauched-job-id',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/lauched-job-id'
    }
  },
  runningJob: {
    type: 'io.cozy.jobs',
    id: 'running-job-id',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/running-job-id'
    }
  },
  doneJob: {
    type: 'io.cozy.jobs',
    id: 'done-job-id',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'done',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/done-job-id'
    }
  }
}

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

const addPermissionMock = jest.fn()
const addReferencesToMock = jest.fn()
const createTriggerMock = jest.fn()
const createDirectoryByPathMock = jest.fn()
const statDirectoryByPathMock = jest.fn()
const launchTriggerMock = jest.fn()
const saveAccountMock = jest.fn()

const tMock = jest.fn()

const props = {
  addPermission: addPermissionMock,
  addReferencesTo: addReferencesToMock,
  konnector: fixtures.konnector,
  createTrigger: createTriggerMock,
  createDirectoryByPath: createDirectoryByPathMock,
  statDirectoryByPath: statDirectoryByPathMock,
  saveAccount: saveAccountMock,
  launch: launchTriggerMock,
  t: tMock,
  vaultClient: mockVaultClient,
  breakpoints: { isMobile: false },
  onVaultDismiss: jest.fn()
}

const propsWithAccount = {
  ...props,
  account: fixtures.existingAccount,
  trigger: fixtures.existingTrigger
}

const defaultOnError = error => {
  throw error
}

const setup = ({
  konnector = fixtures.konnector,
  account,
  trigger,
  onError = defaultOnError
} = {}) => {
  const root = shallow(
    <TriggerManager
      {...props}
      konnector={konnector}
      trigger={trigger}
      account={account}
      onError={onError}
    />
  )
  return { root }
}

const shallowWithoutAccount = konnector => {
  const { root } = setup({ konnector })
  return root
}

const shallowWithAccount = options => {
  const { root } = setup({
    account: fixtures.existingAccount,
    trigger: fixtures.existingTrigger,
    ...options
  })
  return root
}

const isHigherComponentOfDisplayName = displayName => node => {
  const type = node.type()
  return type.displayName && type.displayName.includes(`(${displayName})`)
}

describe('TriggerManager', () => {
  beforeEach(() => {
    createTriggerMock.mockResolvedValue(fixtures.createdTrigger)
    saveAccountMock.mockResolvedValue(fixtures.createdAccount)
    mockVaultClient.createNewCozySharedCipher.mockResolvedValue({
      id: 'cipher-id-1'
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('when given an oauth konnector', () => {
    it('should redirect to OAuthForm', () => {
      const konnector = {
        oauth: {
          scope: 'test'
        }
      }
      const component = shallow(
        <TriggerManager {...props} konnector={konnector} />
      ).getElement()
      expect(component).toMatchSnapshot()
    })
  })

  describe('when given no account', () => {
    it('should render correctly', () => {
      const component = shallowWithoutAccount().getElement()
      expect(component).toMatchSnapshot()
    })

    describe('when the vault does not contain ciphers', () => {
      it('should show the new account form', async () => {
        mockVaultClient.getAll.mockResolvedValue([])
        mockVaultClient.getAllDecrypted.mockResolvedValue([])

        const { findByLabelText } = render(<TriggerManager {...props} />)

        const usernameField = await findByLabelText('username')
        const passwordField = await findByLabelText('passphrase')

        expect(usernameField).toBeDefined()
        expect(passwordField).toBeDefined()
      })
    })

    describe('when the vault contains ciphers', () => {
      it('should show the ciphers list', async () => {
        mockVaultClient.getAll.mockResolvedValue([{ id: 'cipher1' }])
        mockVaultClient.getAllDecrypted.mockResolvedValue([
          {
            id: 'cipher1',
            name: fixtures.konnector.name,
            login: {
              username: 'Isabelle'
            }
          }
        ])

        const { findByText } = render(<TriggerManager {...props} />)

        const cipherItem = await findByText('Isabelle')

        expect(cipherItem).toBeDefined()
      })
    })
  })

  describe('when given an account', () => {
    it('should render correctly', () => {
      const component = shallowWithAccount().getElement()
      expect(component).toMatchSnapshot()
    })
  })

  describe('handleError', () => {
    beforeEach(() => {
      statDirectoryByPathMock.mockResolvedValue(fixtures.folder)
      createDirectoryByPathMock.mockResolvedValue(fixtures.folder)
    })

    it('should render error', async () => {
      const wrapper = shallowWithAccount({ onError: null })
      await wrapper.instance().handleError(new Error('Test error'))
      expect(wrapper.getElement()).toMatchSnapshot()
    })

    const clientMutations = {
      saveAccount: saveAccountMock,
      createDirectoryByPath: createDirectoryByPathMock,
      addPermission: addPermissionMock,
      addReferencesTo: addReferencesToMock,
      createTrigger: createTriggerMock,
      statDirectoryByPath: statDirectoryByPathMock
    }

    for (var mutation of Object.keys(clientMutations)) {
      const mutationSync = mutation
      it(`should be called when ${mutation} fails`, async () => {
        clientMutations[mutationSync].mockRejectedValue(
          new Error(`${mutationSync} error`)
        )

        if (mutationSync !== 'statDirectoryByPath') {
          statDirectoryByPathMock.mockResolvedValue(null)
        }

        const wrapper = shallowWithoutAccount(fixtures.konnectorWithFolder)

        jest
          .spyOn(wrapper.instance(), 'handleError')
          .mockImplementation(() => {})

        await wrapper.instance().handleSubmit(fixtures.data)
        expect(wrapper.instance().handleError).toHaveBeenCalledWith(
          new Error(`${mutationSync} error`)
        )
      })
    }
  })

  describe('handleSubmit', () => {
    const isSubmitting = wrapper => {
      // TODO: test disabled prop of submit button instead of the internal state
      return wrapper.state().status == 'RUNNING'
    }

    it('should render as submitting when there is no account', async () => {
      const wrapper = shallowWithoutAccount()
      const submitPromise = wrapper.instance().handleSubmit()
      expect(isSubmitting(wrapper)).toBe(true)
      await submitPromise
    })

    it('should render as submitting when there is an account', async () => {
      const wrapper = shallowWithAccount()
      const submitPromise = wrapper.instance().handleSubmit()
      expect(isSubmitting(wrapper)).toBe(true)
      await submitPromise
    })

    it('should stop being rendered as submitting on error', async () => {
      const wrapper = shallowWithAccount()
      mockVaultClient.isLocked.mockReset().mockImplementationOnce(() => {
        throw new Error('fakeerror')
      })

      try {
        await wrapper.instance().handleSubmit(fixtures.data)
        expect(mockVaultClient.isLocked).toHaveBeenCalledTimes(1)
      } catch (e) {
        // eslint-disable-next-line no-empty
      }

      expect(isSubmitting(wrapper)).toBe(false)
    })

    it('should call saveAccount without account', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().handleSubmit(fixtures.data)
      expect(saveAccountMock).toHaveBeenCalledWith(
        fixtures.konnector,
        expect.objectContaining(fixtures.account)
      )
    })

    it('should call saveAccount with account (no password provided)', async () => {
      const wrapper = shallowWithAccount()

      mockVaultClient.decrypt.mockResolvedValueOnce({
        login: {
          username: 'username',
          password: 'password'
        }
      })

      await wrapper.instance().handleSubmit({ username: 'foo' })
      expect(saveAccountMock).toHaveBeenCalledWith(
        fixtures.konnector,
        expect.objectContaining(fixtures.existingAccount)
      )
    })

    it('should call saveAccount with account with RESET_SESSION state if passphrase changed', async () => {
      const wrapper = shallowWithAccount()

      mockVaultClient.decrypt.mockResolvedValueOnce({
        login: {
          username: 'username',
          password: 'password'
        }
      })

      await wrapper.instance().handleSubmit(fixtures.data)
      expect(saveAccountMock).toHaveBeenCalled()
      expect(saveAccountMock.mock.calls[0][1].state).toEqual('RESET_SESSION')
    })

    it('should call saveAccount with account with RESET_SESSION state if password changed', async () => {
      const wrapper = shallowWithAccount()
      const instance = wrapper.instance()

      mockVaultClient.decrypt.mockResolvedValueOnce({
        login: {
          username: 'username',
          password: 'password'
        }
      })

      await instance.handleSubmit({
        login: 'foo',
        password: 'bar'
      })

      expect(saveAccountMock).toHaveBeenCalled()
      expect(saveAccountMock.mock.calls[0][1].state).toEqual('RESET_SESSION')
    })

    it('should call handleNewAccount with account', async () => {
      const wrapper = shallowWithAccount()
      const instance = wrapper.instance()
      jest
        .spyOn(instance, 'handleNewAccount')
        .mockResolvedValue(fixtures.launchedJob)

      mockVaultClient.decrypt.mockResolvedValueOnce({
        login: {
          username: 'username',
          password: 'password'
        }
      })

      await instance.handleSubmit(fixtures.data)

      expect(instance.handleNewAccount).toHaveBeenCalledWith(
        fixtures.createdAccount
      )
    })

    it('should call handleNewAccount without account', async () => {
      const wrapper = shallowWithoutAccount()
      const instance = wrapper.instance()
      jest
        .spyOn(instance, 'handleNewAccount')
        .mockResolvedValue(fixtures.launchedJob)

      await instance.handleSubmit(fixtures.data)

      expect(instance.handleNewAccount).toHaveBeenCalledWith(
        fixtures.createdAccount
      )
    })

    describe('custom konnector policy', () => {
      const konnector = {
        ...fixtures.konnector,
        partnership: {
          domain: 'budget-insight.com'
        }
      }

      const account = {
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

      it('should display the account form (when no account)', () => {
        const { root } = setup({
          account: null,
          konnector
        })

        expect(
          root.findWhere(isHigherComponentOfDisplayName('AccountForm')).length
        ).toBe(1)

        expect(root.find('VaultUnlocker').length).toBe(0)
      })

      it('should display the account form (when account)', () => {
        const { root } = setup({
          account: null,
          konnector
        })

        expect(
          root.findWhere(isHigherComponentOfDisplayName('AccountForm')).length
        ).toBe(1)

        expect(root.find('VaultUnlocker').length).toBe(0)
      })

      it('should use custom konnector policy', async () => {
        saveAccountMock.mockReset().mockImplementation((konnector, acc) => ({
          ...acc,
          _id: fixtures.updatedAccount._id
        }))

        biKonnectorPolicy.onAccountCreation
          .mockReset()
          .mockReturnValue(onAccountCreationResult)

        const { root } = setup({
          account,
          konnector
        })

        const instance = root.instance()
        jest
          .spyOn(instance, 'handleNewAccount')
          .mockResolvedValue(fixtures.launchedJob)

        await instance.handleSubmit(
          fixtures.bankingKonnectorAccountAttributes.auth
        )

        expect(biKonnectorPolicy.onAccountCreation).toHaveBeenCalledTimes(1)
        expect(instance.handleNewAccount).toHaveBeenCalledTimes(1)
        expect(saveAccountMock).toHaveBeenCalledWith(
          konnector,
          onAccountCreationResult
        )
      })
    })
  })

  describe('handleNewAccount', () => {
    beforeAll(() => {
      jest.spyOn(cronHelpers, 'fromFrequency').mockReturnValue('0 0 0 * * 0')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      jest.restoreAllMocks()
    })

    it('should create trigger', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().handleNewAccount(fixtures.createdAccount)
      expect(createTriggerMock).toHaveBeenCalledTimes(1)
      expect(createTriggerMock).toHaveBeenCalledWith(fixtures.triggerAttributes)
    })

    it('should not create trigger when one is passed as prop', async () => {
      const wrapper = shallow(<TriggerManager {...propsWithAccount} />)
      await wrapper.instance().handleNewAccount(fixtures.updatedAccount)
      expect(createTriggerMock).not.toHaveBeenCalled()
    })

    it('should launch trigger without account', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().handleNewAccount(fixtures.account)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    describe('when konnector needs folder', () => {
      beforeEach(() => {
        tMock.mockReturnValue('/Administrative')
      })

      afterEach(() => {
        tMock.mockReset()
      })

      it('should create folder if it does not exist', async () => {
        statDirectoryByPathMock.mockResolvedValue(null)
        createDirectoryByPathMock.mockReturnValue(fixtures.folder)

        const wrapper = shallowWithoutAccount(fixtures.konnectorWithFolder)
        await wrapper.instance().handleNewAccount(fixtures.account)

        expect(statDirectoryByPathMock).toHaveBeenCalledTimes(1)
        expect(createDirectoryByPathMock).toHaveBeenCalledTimes(1)
        expect(createDirectoryByPathMock).toHaveBeenCalledWith(
          fixtures.folderPath
        )
        expect(addPermissionMock).toHaveBeenCalledTimes(1)
        expect(addPermissionMock).toHaveBeenCalledWith(
          fixtures.konnectorWithFolder,
          fixtures.folderPermission
        )
        expect(addReferencesToMock).toHaveBeenCalledTimes(1)
        expect(addReferencesToMock).toHaveBeenCalledWith(
          fixtures.konnectorWithFolder,
          [fixtures.folder]
        )
      })

      it('should not create folder if it exists', async () => {
        statDirectoryByPathMock.mockResolvedValue(fixtures.folder)

        const wrapper = shallowWithoutAccount(fixtures.konnectorWithFolder)
        await wrapper.instance().handleNewAccount(fixtures.account)

        expect(statDirectoryByPathMock).toHaveBeenCalledTimes(1)
        expect(createDirectoryByPathMock).toHaveBeenCalledTimes(0)

        expect(addPermissionMock).toHaveBeenCalledTimes(1)
        expect(addPermissionMock).toHaveBeenCalledWith(
          fixtures.konnectorWithFolder,
          fixtures.folderPermission
        )
        expect(addReferencesToMock).toHaveBeenCalledTimes(1)
        expect(addReferencesToMock).toHaveBeenCalledWith(
          fixtures.konnectorWithFolder,
          [fixtures.folder]
        )
      })
    })

    it('should launch trigger with account', async () => {
      const wrapper = shallowWithAccount()
      await wrapper.instance().handleNewAccount(fixtures.updatedAccount)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.existingTrigger)
    })

    it('should keep updated account in state', async () => {
      const wrapper = shallowWithAccount()
      await wrapper.instance().handleNewAccount(fixtures.updatedAccount)
      expect(wrapper.state().account).toEqual(fixtures.updatedAccount)
    })
  })
})
