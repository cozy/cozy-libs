/* eslint-env jest */
import {
  createTrigger,
  launchTrigger,
  ensureTrigger
} from 'connections/triggers'
import CozyClient from 'cozy-client'

import {
  statDirectoryByPath,
  createDirectoryByPath
} from '../../src/connections/files'

import fixtures from '../../test/fixtures'
import en from '../../src/locales/en'
import Polyglot from 'node-polyglot'
import { CozyFolder } from 'cozy-doctypes'

jest.mock('../../src/connections/files', () => ({
  statDirectoryByPath: jest.fn(),
  createDirectoryByPath: jest.fn()
}))

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
const fakeT = polyglot.t.bind(polyglot)

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

  const permissionCollection = {
    add: jest.fn().mockResolvedValue({})
  }

  const fileCollection = {
    addReferencesTo: jest.fn().mockResolvedValue({})
  }

  jest.spyOn(CozyClient.prototype, 'collection').mockImplementation(doctype => {
    if (doctype == 'io.cozy.triggers') {
      return triggerCollection
    } else if (doctype == 'io.cozy.permissions') {
      return permissionCollection
    } else if (doctype == 'io.cozy.files') {
      return fileCollection
    }
  })

  return {
    client,
    triggerCollection,
    permissionCollection,
    fileCollection
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

describe('when konnector needs folder', () => {
  it('should create folder if it does not exist', async () => {
    const { client, permissionCollection, fileCollection } = setup()
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

    expect(permissionCollection.add).toHaveBeenCalledTimes(1)
    expect(permissionCollection.add).toHaveBeenCalledWith(
      fixtures.konnectorWithFolder,
      fixtures.folderPermission
    )

    const addReferencesTo = fileCollection.addReferencesTo
    expect(addReferencesTo).toHaveBeenCalledTimes(1)
    expect(addReferencesTo).toHaveBeenCalledWith(fixtures.konnectorWithFolder, [
      fixtures.folder
    ])
  })

  it('should not create folder if it exists', async () => {
    const { client, permissionCollection, fileCollection } = setup()
    statDirectoryByPath.mockResolvedValue(fixtures.folder)

    await ensureTrigger(client, {
      account: fixtures.account,
      konnector: fixtures.konnectorWithFolder,
      t: fakeT
    })

    expect(statDirectoryByPath).toHaveBeenCalledTimes(1)
    expect(createDirectoryByPath).toHaveBeenCalledTimes(0)

    const addPermission = permissionCollection.add
    expect(addPermission).toHaveBeenCalledTimes(1)
    expect(addPermission).toHaveBeenCalledWith(
      fixtures.konnectorWithFolder,
      fixtures.folderPermission
    )

    const addReferencesTo = fileCollection.addReferencesTo
    expect(addReferencesTo).toHaveBeenCalledTimes(1)
    expect(addReferencesTo).toHaveBeenCalledWith(fixtures.konnectorWithFolder, [
      fixtures.folder
    ])
  })
})
