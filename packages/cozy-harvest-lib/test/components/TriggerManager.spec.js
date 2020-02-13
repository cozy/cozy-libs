/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { render, fireEvent, cleanup } from '@testing-library/react'

import { DumbTriggerManager as TriggerManager } from 'components/TriggerManager'
import fixtures from '../../test/fixtures'
import ConnectionFlow from '../../src/models/ConnectionFlow'
import CozyClient from 'cozy-client'

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
const props = {
  konnector: fixtures.konnector,
  flow: new ConnectionFlow(client),
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

describe('TriggerManager', () => {
  beforeEach(() => {
    mockVaultClient.createNewCozySharedCipher.mockResolvedValue({
      id: 'cipher-id-1'
    })
    tMock.mockImplementation(key => key)
  })

  afterEach(() => {
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
    describe('when the vault does not contain ciphers', () => {
      beforeEach(() => {
        mockVaultClient.getAll.mockResolvedValue([])
        mockVaultClient.getAllDecrypted.mockResolvedValue([])
      })

      it('should show the new account form', async () => {
        const { findByLabelText, findByTitle } = render(
          <TriggerManager {...props} />
        )

        expect(findByLabelText('username')).resolves.toBeDefined()
        expect(findByLabelText('passphrase')).resolves.toBeDefined()
        expect(findByTitle('back')).rejects.toThrow()
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
        const { findByText } = render(<TriggerManager {...props} />)

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
            <TriggerManager {...props} />
          )

          const cipherItem = await findByText('Isabelle')

          fireEvent.click(cipherItem)

          const passwordField = await findByLabelText('passphrase')
          const backButton = await findByTitle('back')

          expect(findByLabelText('username')).rejects.toThrow()
          expect(passwordField).toBeDefined()
          expect(backButton).toBeDefined()

          fireEvent.click(backButton)

          expect(findByText('Isabelle')).resolves.toBeDefined()
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
          <TriggerManager {...propsWithAccount} />
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
          <TriggerManager {...propsWithAccount} />
        )

        const usernameField = await findByLabelText('username')
        const passwordField = await findByLabelText('passphrase')

        expect(usernameField).toBeDefined()
        expect(passwordField).toBeDefined()
      })
    })
  })
})
