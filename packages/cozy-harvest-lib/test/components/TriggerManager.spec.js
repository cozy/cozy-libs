/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'

import { TriggerManager } from 'components/TriggerManager'
import cronHelpers from 'helpers/cron'

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

const addPermissionMock = jest.fn()
const addReferencesToMock = jest.fn()
const createTriggerMock = jest.fn()
const createDirectoryByPathMock = jest.fn()
const statDirectoryByPathMock = jest.fn()
const launchTriggerMock = jest.fn()
const saveAccountMock = jest.fn()
const waitForLoginSuccessMock = jest.fn()

const onSuccessSpy = jest.fn()
const onLoginSuccessSpy = jest.fn()

const tMock = jest.fn().mockReturnValue('/Administrative')

const shallowWithoutAccount = konnector =>
  shallow(
    <TriggerManager
      addPermission={addPermissionMock}
      addReferencesTo={addReferencesToMock}
      konnector={konnector || fixtures.konnector}
      createTrigger={createTriggerMock}
      createDirectoryByPath={createDirectoryByPathMock}
      statDirectoryByPath={statDirectoryByPathMock}
      launchTrigger={launchTriggerMock}
      onSuccess={onSuccessSpy}
      onLoginSuccess={onLoginSuccessSpy}
      saveAccount={saveAccountMock}
      t={tMock}
      waitForLoginSuccess={waitForLoginSuccessMock}
    />
  )

const shallowWithAccount = () =>
  shallow(
    <TriggerManager
      account={fixtures.createdAccount}
      createTrigger={createTriggerMock}
      konnector={fixtures.konnector}
      launchTrigger={launchTriggerMock}
      onSuccess={onSuccessSpy}
      onLoginSuccess={onLoginSuccessSpy}
      saveAccount={saveAccountMock}
      trigger={fixtures.createdTrigger}
      waitForLoginSuccess={waitForLoginSuccessMock}
    />
  )

describe('TriggerManager', () => {
  beforeEach(() => {
    createTriggerMock.mockResolvedValue(fixtures.createdTrigger)
    launchTriggerMock.mockResolvedValue(fixtures.launchedJob)
    saveAccountMock.mockResolvedValue(fixtures.createdAccount)
    waitForLoginSuccessMock.mockResolvedValue(fixtures.runningJob)
  })

  afterEach(() => {
    createTriggerMock.mockClear()
    launchTriggerMock.mockClear()
    onSuccessSpy.mockClear()
    onLoginSuccessSpy.mockClear()
    waitForLoginSuccessMock.mockClear()
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
    it('should render error', () => {
      const wrapper = shallowWithAccount()
      wrapper.instance().handleError(new Error('Test error'))
      expect(wrapper.getElement()).toMatchSnapshot()
    })

    const clientMutations = {
      saveAccount: saveAccountMock,
      statDirectoryByPath: statDirectoryByPathMock,
      createDirectoryByPath: createDirectoryByPathMock,
      addPermission: addPermissionMock,
      addReferencesTo: addReferencesToMock,
      createTrigger: createTriggerMock,
      launchTrigger: launchTriggerMock
    }

    for (var mutation of Object.keys(clientMutations)) {
      it(`should be called when ${mutation} fails`, async () => {
        clientMutations[mutation].mockRejectedValue(
          new Error(`${mutation} error`)
        )

        const wrapper = shallowWithoutAccount()

        jest
          .spyOn(wrapper.instance(), 'handleError')
          .mockImplementation(() => {})

        await wrapper.instance().handleSubmit(fixtures.data)
        expect(wrapper.instance().handleError).toHaveBeenCalledWith(
          new Error(`${mutation} error`)
        )
      })
    }
  })

  describe('handleSubmit', () => {
    it('should render without account as submitting', () => {
      const wrapper = shallowWithoutAccount()
      wrapper.instance().handleSubmit()
      expect(wrapper.props().submitting).toEqual(true)
    })

    it('should render with account as submitting', () => {
      const wrapper = shallowWithAccount()
      wrapper.instance().handleSubmit()
      expect(wrapper.props().submitting).toEqual(true)
    })

    it('should call saveAccount without account', () => {
      const wrapper = shallowWithoutAccount()
      wrapper.instance().handleSubmit(fixtures.data)
      expect(saveAccountMock).toHaveBeenCalledWith(
        fixtures.konnector,
        fixtures.account
      )
    })

    it('should call saveAccount with account', () => {
      const wrapper = shallowWithAccount()
      wrapper.instance().handleSubmit(fixtures.data)
      expect(saveAccountMock).toHaveBeenCalledWith(
        fixtures.konnector,
        fixtures.createdAccount
      )
    })

    it('should call handleAccountSaveSuccess with account', async () => {
      const wrapper = shallowWithAccount()
      const instance = wrapper.instance()
      jest
        .spyOn(instance, 'handleAccountSaveSuccess')
        .mockResolvedValue(fixtures.launchedJob)

      await instance.handleSubmit(fixtures.data)

      expect(instance.handleAccountSaveSuccess).toHaveBeenCalledWith(
        fixtures.createdAccount
      )
    })

    it('should call handleAccountSaveSuccess without account', async () => {
      const wrapper = shallowWithoutAccount()
      const instance = wrapper.instance()
      jest
        .spyOn(instance, 'handleAccountSaveSuccess')
        .mockResolvedValue(fixtures.launchedJob)

      await instance.handleSubmit(fixtures.data)

      expect(instance.handleAccountSaveSuccess).toHaveBeenCalledWith(
        fixtures.createdAccount
      )
    })
  })

  describe('handleAccountSaveSuccess', () => {
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
      await wrapper.instance().handleAccountSaveSuccess(fixtures.createdAccount)
      expect(createTriggerMock).toHaveBeenCalledTimes(1)
      expect(createTriggerMock).toHaveBeenCalledWith(fixtures.triggerAttributes)
    })

    it('should launch trigger without account', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().handleAccountSaveSuccess(fixtures.account)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    describe('when konnector needs folder', () => {
      it('should create folder if it does not exist', async () => {
        statDirectoryByPathMock.mockResolvedValue(null)
        createDirectoryByPathMock.mockReturnValue(fixtures.folder)

        const wrapper = shallowWithoutAccount(fixtures.konnectorWithFolder)
        await wrapper.instance().handleAccountSaveSuccess(fixtures.account)

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
        await wrapper.instance().handleAccountSaveSuccess(fixtures.account)

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
      await wrapper.instance().handleAccountSaveSuccess(fixtures.updatedAccount)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    it('should keep updated account in state', async () => {
      const wrapper = shallowWithAccount()
      await wrapper.instance().handleAccountSaveSuccess(fixtures.updatedAccount)
      expect(wrapper.state().account).toEqual(fixtures.updatedAccount)
    })
  })

  describe('launch', () => {
    it('should launch trigger', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(launchTriggerMock).toHaveBeenCalledTimes(1)
      expect(launchTriggerMock).toHaveBeenCalledWith(fixtures.createdTrigger)
    })

    it('should wait for successful login', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(waitForLoginSuccessMock).toHaveBeenCalledTimes(1)
      expect(waitForLoginSuccessMock).toHaveBeenCalledWith(fixtures.launchedJob)
    })

    it('should call onLoginSuccess', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(onLoginSuccessSpy).toHaveBeenCalledTimes(1)
      expect(onLoginSuccessSpy).toHaveBeenCalledWith(fixtures.createdTrigger)
      expect(onSuccessSpy).not.toHaveBeenCalled()
    })

    it('should not call onLoginSucces if job is done', async () => {
      waitForLoginSuccessMock.mockResolvedValue(fixtures.doneJob)
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().launch(fixtures.createdTrigger)
      expect(onLoginSuccessSpy).not.toHaveBeenCalled()
      expect(onSuccessSpy).toHaveBeenCalledTimes(1)
      expect(onSuccessSpy).toHaveBeenCalledWith(fixtures.createdTrigger)
    })
  })
})
