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

    describe('when the vault contains ciphers', () => {
      it('should show the account form', async () => {
        mockVaultClient.getAll.mockResolvedValue([])
        mockVaultClient.getAllDecrypted.mockResolvedValue([])

        const { findByLabelText } = render(
          <TriggerManager {...propsWithAccount} />
        )

        const usernameField = await findByLabelText('username')
        const passwordField = await findByLabelText('passphrase')

        expect(usernameField).toBeDefined()
        expect(passwordField).toBeDefined()
      })
    })

    describe('when the vault does not contain ciphers', () => {
      it('should show the account form', async () => {
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

        const { findByLabelText } = render(
          <TriggerManager {...propsWithAccount} />
        )

        const usernameField = await findByLabelText('username')
        const passwordField = await findByLabelText('passphrase')

        expect(usernameField).toBeDefined()
        expect(passwordField).toBeDefined()
      })
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
})
