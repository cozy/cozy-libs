/* eslint-env jest */
import { triggersMutations, ensureTrigger } from 'connections/triggers'
import CozyClient from 'cozy-client'

import {
  statDirectoryByPath,
  createDirectoryByPath
} from '../../src/connections/files'

import fixtures from '../../test/fixtures'
import en from '../../src/locales/en'
import Polyglot from 'node-polyglot'
import { CozyFolder } from 'cozy-doctypes'

import TriggerCollection from 'cozy-stack-client/dist/TriggerCollection'
import JobCollection from 'cozy-stack-client/dist/JobCollection'
import PermissionCollection from 'cozy-stack-client/dist/PermissionCollection'
import FileCollection from 'cozy-stack-client/dist/FileCollection'

jest.mock('../../src/connections/files', () => ({
  statDirectoryByPath: jest.fn(),
  createDirectoryByPath: jest.fn()
}))

beforeEach(() => {
  jest.spyOn(TriggerCollection.prototype, 'create').mockResolvedValue({
    data: fixtures.createdTrigger
  })
  jest.spyOn(TriggerCollection.prototype, 'launch').mockResolvedValue({
    data: fixtures.launchedJob
  })
  jest.spyOn(PermissionCollection.prototype, 'add').mockResolvedValue({
  })
  jest.spyOn(FileCollection.prototype, 'addReferencesTo').mockResolvedValue({
  })
})

afterEach(() => {
  jest.restoreAllMocks()
  statDirectoryByPath.mockClear()
  createDirectoryByPath.mockClear()
})

CozyFolder.copyWithClient = () => ({
  magicFolders: CozyFolder.magicFolders,
  ensureMagicFolder: (id, path) => ({
    path
  })
})

const polyglot = new Polyglot()
polyglot.extend(en)
const fakeT  = polyglot.t.bind(polyglot)

const client = new CozyClient({})

const { createTrigger, launchTrigger } = triggersMutations(client)

describe('Trigger mutations', () => {
  describe('createTrigger', () => {
    it('calls Cozy Client and returns trigger', async () => {
      const result = await createTrigger(fixtures.trigger)
      expect(client.collection().create).toHaveBeenCalledWith(fixtures.trigger)
      expect(result).toEqual(fixtures.createdTrigger)
    })
  })

  describe('launchTrigger', () => {
    it('calls expected endpoint', async () => {
      const result = await launchTrigger(fixtures.trigger)
      expect(client.collection().launch).toHaveBeenCalledWith(fixtures.trigger)
      expect(result).toEqual(fixtures.launchedJob)
    })
  })
})

describe('when konnector needs folder', () => {
  fit('should create folder if it does not exist', async () => {
    statDirectoryByPath.mockResolvedValue(null)
    createDirectoryByPath.mockReturnValue(fixtures.folder)

    await ensureTrigger(client, {
      konnector: fixtures.konnectorWithFolder,
      account: fixtures.account,
      t: fakeT
    })

    expect(statDirectoryByPath).toHaveBeenCalledTimes(1)
    expect(createDirectoryByPath).toHaveBeenCalledTimes(1)
    expect(createDirectoryByPath).toHaveBeenCalledWith(
      client,
      fixtures.folderPath
    )

    const addPermission = PermissionCollection.prototype.add
    expect(addPermission).toHaveBeenCalledTimes(1)
    expect(addPermission).toHaveBeenCalledWith(
      fixtures.konnectorWithFolder,
      fixtures.folderPermission
    )

    const addReferencesTo = FileCollection.prototype.addReferencesTo
    expect(addReferencesTo).toHaveBeenCalledTimes(1)
    expect(addReferencesTo).toHaveBeenCalledWith(
      fixtures.konnectorWithFolder,
      [fixtures.folder]
    )
  })

  fit('should not create folder if it exists', async () => {
    statDirectoryByPath.mockResolvedValue(fixtures.folder)

    await ensureTrigger(client, {
      account: fixtures.account,
      konnector: fixtures.konnectorWithFolder,
      t: fakeT
    })

    expect(statDirectoryByPath).toHaveBeenCalledTimes(1)
    expect(createDirectoryByPath).toHaveBeenCalledTimes(0)

    const addPermission = PermissionCollection.prototype.add
    expect(addPermission).toHaveBeenCalledTimes(1)
    expect(addPermission).toHaveBeenCalledWith(
      fixtures.konnectorWithFolder,
      fixtures.folderPermission
    )

    const addReferencesTo = FileCollection.prototype.addReferencesTo
    expect(addReferencesTo).toHaveBeenCalledTimes(1)
    expect(addReferencesTo).toHaveBeenCalledWith(
      fixtures.konnectorWithFolder,
      [fixtures.folder]
    )
  })
})
