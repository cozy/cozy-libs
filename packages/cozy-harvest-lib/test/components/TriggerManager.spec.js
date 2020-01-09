/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { DumbTriggerManager as TriggerManager } from 'components/TriggerManager'
import cronHelpers from 'helpers/cron'

jest.mock('cozy-doctypes', () => {
  const CozyFolder = {
    copyWithClient: () => CozyFolder,
    ensureMagicFolder: () => ({ path: '/Administrative' }),
    magicFolders: {
      ADMINISTRATIVE: 'io.cozy.apps/administrative',
      PHOTOS: '/photos'
    }
  }
  return {
    CozyFolder
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
      account: 'a87f9a8bd3884479a48811e7b7deec75',
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
    _id: 'a87f9a8bd3884479a48811e7b7deec75',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  updatedAccount: {
    _id: 'a87f9a8bd3884479a48811e7b7deec75',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'fuz'
    }
  },
  existingAccount: {
    _id: '61c683295560485db0f34b859197c581',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  existingTrigger: {
    id: '4b67e0bedd464704a6a995f5c2070ccf',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: '61c683295560485db0f34b859197c581',
        konnector: 'konnectest'
      }
    }
  },
  createdTrigger: {
    id: '669e9a7cc3064a97bc0aa20feef71cb2',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'a87f9a8bd3884479a48811e7b7deec75',
        konnector: 'konnectest'
      }
    }
  },
  launchedJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  },
  runningJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  },
  doneJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'done',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
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
  breakpoints: { isMobile: false }
}

const propsWithAccount = {
  ...props,
  account: fixtures.existingAccount,
  trigger: fixtures.existingTrigger
}

const shallowWithoutAccount = konnector =>
  shallow(
    <TriggerManager {...props} konnector={konnector || fixtures.konnector} />
  )

const shallowWithAccount = () =>
  shallow(<TriggerManager {...propsWithAccount} />)

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

  it('should render without account', () => {
    const component = shallowWithoutAccount().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render with account', () => {
    const component = shallowWithAccount().getElement()
    expect(component).toMatchSnapshot()
  })

  describe('handleError', () => {
    beforeEach(() => {
      statDirectoryByPathMock.mockResolvedValue(fixtures.folder)
      createDirectoryByPathMock.mockResolvedValue(fixtures.folder)
    })

    it('should render error', async () => {
      const wrapper = shallowWithAccount()
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
    it('should render as submitting when there is no account', () => {
      const wrapper = shallowWithoutAccount()
      wrapper.instance().handleSubmit()
      expect(wrapper.state().status).toEqual('RUNNING') // TODO: test disabled prop of submit button instead of the internal state
    })

    it('should render as submitting when there is an account', () => {
      const wrapper = shallowWithAccount()
      wrapper.instance().handleSubmit()
      expect(wrapper.state().status).toEqual('RUNNING')
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

      await wrapper.instance().handleSubmit({ login: 'test' })
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
