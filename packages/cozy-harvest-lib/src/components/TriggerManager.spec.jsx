/* eslint-env jest */
import { render, fireEvent, cleanup, screen } from '@testing-library/react'
import { DumbTriggerManager as TriggerManager } from 'components/TriggerManager'
import omit from 'lodash/omit'
import React from 'react'

import CozyClient from 'cozy-client'

import { MountPointContext } from './MountPointContext'
import ConnectionFlow from '../../src/models/ConnectionFlow'
import AppLike from '../../test/AppLike'
import fixtures from '../../test/fixtures'
import { checkMaxAccounts } from '../helpers/accounts'
import { findKonnectorPolicy } from '../konnector-policies'

const { findKonnectorPolicy: originalFindKonnectorPolicy } = jest.requireActual(
  '../konnector-policies'
)

jest.mock('../konnector-policies', () => {
  return {
    findKonnectorPolicy: jest.fn()
  }
})

jest.mock('cozy-keys-lib', () => {
  const actual = jest.requireActual('cozy-keys-lib')
  return {
    ...actual,
    withVaultUnlockContext: Component => Component
  }
})
jest.mock('cozy-ui/transpiled/react/utils/color')
jest.mock('cozy-ui/transpiled/react/AppIcon', () => () => null)
jest.mock('../../src/components/KonnectorIcon', () => () => null)
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

jest.mock('../../src/policies/budget-insight', () => {
  const originalBudgetInsight = jest.requireActual(
    '../../src/policies/budget-insight'
  )
  return {
    konnectorPolicy: {
      ...originalBudgetInsight.konnectorPolicy,
      onAccountCreation: jest.fn()
    }
  }
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

const tMock = jest.fn()

const client = new CozyClient({})
client.plugins.realtime = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn()
}
const props = {
  konnector: fixtures.konnector,
  flow: new ConnectionFlow(client, undefined, fixtures.konnector),
  flowState: {},
  t: tMock,
  vaultClient: mockVaultClient,
  breakpoints: { isMobile: false },
  onVaultDismiss: jest.fn(),
  fieldOptions: {},
  client: {
    query: jest.fn(() => ({
      data: []
    }))
  }
}

const propsWithAccount = {
  ...props,
  flow: new ConnectionFlow(
    client,
    fixtures.existingTrigger,
    fixtures.konnector
  ),
  account: fixtures.existingAccount,
  trigger: fixtures.existingTrigger
}

const oAuthKonnector = {
  oauth: {
    scope: 'test'
  }
}

const bankingKonnector = {
  oauth: {
    scope: 'test'
  },
  categories: ['banking']
}
const oAuthProps = {
  ...props,
  konnector: oAuthKonnector,
  flow: new ConnectionFlow(client, undefined, oAuthKonnector)
}

jest.mock('../helpers/accounts', () => ({
  ...jest.requireActual('../helpers/accounts'),
  checkMaxAccounts: jest.fn(() => null)
}))

jest.mock('./AccountsPaywall/AccountsPaywall', () => ({ reason }) => {
  return <div>Show paywall for this reason : {reason}</div>
})

beforeEach(() => {
  findKonnectorPolicy.mockImplementation(originalFindKonnectorPolicy)
})

describe('TriggerManager', () => {
  beforeEach(() => {
    mockVaultClient.createNewCozySharedCipher.mockResolvedValue({
      id: 'cipher-id-1'
    })
    tMock.mockImplementation(key => key)
  })

  afterEach(async () => {
    await cleanup()
  })

  describe('when given an oauth konnector', () => {
    it('should not show a form but only a button to connect with oauth', async () => {
      mockVaultClient.getAll.mockResolvedValue([])
      const mountPointContextValue = {
        replaceHistory: jest.fn()
      }
      const root = render(
        <AppLike>
          <MountPointContext.Provider value={mountPointContextValue}>
            <TriggerManager {...oAuthProps} konnector={oAuthKonnector} />
          </MountPointContext.Provider>
        </AppLike>
      )
      await expect(root.findByText('Connect')).resolves.toBeDefined()
      expect(root.queryByLabelText('username')).toBeFalsy()
      expect(root.queryByLabelText('passphrase')).toBeFalsy()
    })

    it('should not show a form but only a button to connect with a banking konnector', async () => {
      mockVaultClient.getAll.mockResolvedValue([])
      const mountPointContextValue = {
        replaceHistory: jest.fn()
      }
      const root = render(
        <AppLike>
          <MountPointContext.Provider value={mountPointContextValue}>
            <TriggerManager {...oAuthProps} konnector={bankingKonnector} />
          </MountPointContext.Provider>
        </AppLike>
      )
      await expect(root.findByText('Add your bank')).resolves.toBeDefined()
      expect(root.queryByLabelText('username')).toBeFalsy()
      expect(root.queryByLabelText('passphrase')).toBeFalsy()
    })
  })

  describe('when given no account', () => {
    describe('when the vault does not contain ciphers', () => {
      beforeEach(() => {
        mockVaultClient.getAll.mockResolvedValue([])
        mockVaultClient.getAllDecrypted.mockResolvedValue([])
      })

      it('should show the new account form', async () => {
        const { findByLabelText, findByTitle } = render(
          <AppLike>
            <TriggerManager {...props} />
          </AppLike>
        )

        await expect(findByLabelText('username')).resolves.toBeDefined()
        await expect(findByLabelText('passphrase')).resolves.toBeDefined()
        await expect(
          findByTitle('back', null, { timeout: 500 })
        ).rejects.toThrow()
      })
    })

    describe('when the vaultClient is not part of the context', () => {
      beforeEach(() => {
        mockVaultClient.getAll.mockResolvedValue([])
        mockVaultClient.getAllDecrypted.mockResolvedValue([])
      })

      it('should show the new account form without any warning', async () => {
        findKonnectorPolicy.mockReturnValue({
          saveInVault: false,
          isRunnable: () => true
        })
        const { findByLabelText, findByTitle } = render(
          <AppLike>
            <TriggerManager {...omit(props, 'vaultClient')} />
          </AppLike>
        )

        await expect(findByLabelText('username')).resolves.toBeDefined()
        await expect(findByLabelText('passphrase')).resolves.toBeDefined()
        await expect(
          findByTitle('back', null, { timeout: 500 })
        ).rejects.toThrow()
      })
    })

    describe('when the vault contains ciphers', () => {
      beforeEach(() => {
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
      })

      it('should show the ciphers list', async () => {
        const { findByText } = render(
          <AppLike>
            <TriggerManager {...props} />
          </AppLike>
        )

        const cipherItem = await findByText('Isabelle')

        expect(cipherItem).toBeDefined()
      })

      describe('when selecting a cipher without password', () => {
        beforeEach(() => {
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
        })

        it('should show the account form with only password field editable', async () => {
          const { findByText, findByLabelText, findByTitle } = render(
            <AppLike>
              <TriggerManager {...props} />
            </AppLike>
          )

          const cipherItem = await findByText('Isabelle')

          fireEvent.click(cipherItem)

          const passwordField = await findByLabelText('passphrase')
          const backButton = await findByTitle('back')

          await expect(
            findByLabelText('username', null, { timeout: 500 })
          ).rejects.toThrow()
          expect(passwordField).toBeDefined()
          expect(backButton).toBeDefined()

          fireEvent.click(backButton)

          await expect(findByText('Isabelle')).resolves.toBeDefined()
        })
      })
    })
  })

  describe('when given an account', () => {
    describe('when the vault contains ciphers', () => {
      beforeEach(() => {
        mockVaultClient.getAll.mockResolvedValue([])
        mockVaultClient.getAllDecrypted.mockResolvedValue([])
      })

      it('should show the account form', async () => {
        const { findByLabelText } = render(
          <AppLike>
            <TriggerManager {...propsWithAccount} />
          </AppLike>
        )

        const usernameField = await findByLabelText('username')
        const passwordField = await findByLabelText('passphrase')

        expect(usernameField).toBeDefined()
        expect(passwordField).toBeDefined()
      })
    })

    describe('when the vault does not contain ciphers', () => {
      beforeEach(() => {
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
      })

      it('should show the account form', async () => {
        const { findByLabelText } = render(
          <AppLike>
            <TriggerManager {...propsWithAccount} />
          </AppLike>
        )

        const usernameField = await findByLabelText('username')
        const passwordField = await findByLabelText('passphrase')

        expect(usernameField).toBeDefined()
        expect(passwordField).toBeDefined()
      })
    })
  })

  describe('sending form', () => {
    beforeEach(() => {
      mockVaultClient.getAll.mockResolvedValue([])
      mockVaultClient.getAllDecrypted.mockResolvedValue([])
    })
    const setupForm = async ({ account } = {}) => {
      const flow = new ConnectionFlow(client, null, fixtures.konnector)
      jest.spyOn(flow, 'handleFormSubmit').mockImplementation(() => {})
      const utils = render(
        <AppLike>
          <TriggerManager {...props} account={account} flow={flow} />
        </AppLike>
      )

      // Identification of inputs is a tad fragile, it should be better
      // if data-test-id were supported by Field
      // See https://github.com/cozy/cozy-ui/issues/1387
      const identifierLabel = await utils.findByLabelText('username')
      const passphraseLabel = await utils.findByLabelText('passphrase')
      const identifierInput = identifierLabel.nextElementSibling
      const passphraseInput =
        passphraseLabel.nextElementSibling instanceof HTMLInputElement
          ? passphraseLabel.nextElementSibling
          : passphraseLabel.nextElementSibling.nextElementSibling
      const submitButton = await utils.findByText('Connect')

      return {
        flow,
        identifierLabel,
        passphraseLabel,
        identifierInput,
        passphraseInput,
        submitButton,

        ...utils
      }
    }

    describe('when no account is passed in props', () => {
      it('should correctly send the form', async () => {
        const { flow, identifierInput, passphraseInput, submitButton } =
          await setupForm()
        fireEvent.change(identifierInput, {
          target: { value: 'my-identifier' }
        })
        fireEvent.change(passphraseInput, {
          target: { value: 'my-passphrase' }
        })
        fireEvent.click(submitButton)
        expect(flow.handleFormSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            account: undefined,
            userCredentials: {
              passphrase: 'my-passphrase',
              username: 'my-identifier'
            }
          })
        )
      })
    })

    describe('when an account is passed in props', () => {
      it('should correctly send the form', async () => {
        const account = {
          auth: {
            identifier: 'my-identifier',
            passphrase: 'my-old-passphrase'
          }
        }
        const { flow, identifierInput, passphraseInput, submitButton } =
          await setupForm({ account })
        fireEvent.change(identifierInput, {
          target: { value: 'my-identifier' }
        })
        fireEvent.change(passphraseInput, {
          target: { value: 'my-passphrase' }
        })
        fireEvent.click(submitButton)
        expect(flow.handleFormSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            account,
            userCredentials: {
              passphrase: 'my-passphrase',
              username: 'my-identifier',
              identifier: 'my-identifier'
            }
          })
        )
      })
    })
  })

  describe('Accounts paywall', () => {
    afterEach(() => {
      jest.clearAllMocks()
    })

    it('should show a paywall when given no account', async () => {
      checkMaxAccounts.mockResolvedValue('max_accounts')
      render(
        <AppLike>
          <TriggerManager {...props} />
        </AppLike>
      )
      expect(
        await screen.findByText('Show paywall for this reason : max_accounts')
      ).toBeDefined()
    })

    it('should show the new account form when checkMaxAccounts return null', async () => {
      checkMaxAccounts.mockResolvedValue(null)
      const { findByLabelText } = render(
        <AppLike>
          <TriggerManager {...props} />
        </AppLike>
      )

      await expect(findByLabelText('username')).resolves.toBeDefined()
      await expect(findByLabelText('passphrase')).resolves.toBeDefined()
    })

    it('should show a paywall when given an oauth konnector', async () => {
      checkMaxAccounts.mockResolvedValue('max_accounts')
      const mountPointContextValue = {
        replaceHistory: jest.fn()
      }
      render(
        <AppLike>
          <MountPointContext.Provider value={mountPointContextValue}>
            <TriggerManager {...oAuthProps} konnector={oAuthKonnector} />
          </MountPointContext.Provider>
        </AppLike>
      )
      expect(
        await screen.findByText('Show paywall for this reason : max_accounts')
      ).toBeDefined()
    })

    it('should no check the paywall condition when given an account', async () => {
      render(
        <AppLike>
          <TriggerManager {...propsWithAccount} />
        </AppLike>
      )

      expect(checkMaxAccounts).not.toBeCalled()
    })
  })
})
