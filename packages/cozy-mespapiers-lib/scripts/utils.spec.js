const {
  getNormalizedDeps,
  isCozypackage,
  getPackagesToUpdate,
  makeUpdatePackagesCommand
} = require('./utils')

const mockLibPackage = {
  'cozy-pck01': '>=2.1.3',
  'cozy-pck02': '>2.1.3',
  'cozy-pck03': '<2.1.3',
  'cozy-pck04': '=2.1.3',
  'cozy-pck05': '>=2.1.3',
  pck01: '>=2.1.3',
  pck02: '>2.1.3',
  pck03: '<2.1.3',
  pck04: '=2.1.3',
  pck05: '>=2.1.3'
}
const mockAppPackage = {
  'cozy-pck01': '^2.0.0',
  'cozy-pck02': '^2.0.0',
  'cozy-pck03': '^2.0.0',
  'cozy-pck04': '^2.0.0',
  'cozy-pck06': '^2.0.0',
  pck01: '2.0.0',
  pck02: '2.0.0',
  pck03: '2.0.0',
  pck04: '2.0.0',
  pck06: '2.0.0'
}

describe('utils', () => {
  describe('getNormalizedDeps', () => {
    it('should return string without specific characters (^|<|>|=)', () => {
      expect(getNormalizedDeps('^1.0.0')).toBe('1.0.0')
      expect(getNormalizedDeps('>1.0.0')).toBe('1.0.0')
      expect(getNormalizedDeps('<1.0.0')).toBe('1.0.0')
      expect(getNormalizedDeps('>=1.0.0')).toBe('1.0.0')
      expect(getNormalizedDeps('<=1.0.0')).toBe('1.0.0')
    })
  })
  describe('isCozypackage', () => {
    it('should return False if package is not prefix by "cozy-"', () => {
      expect(isCozypackage('react-router-dom')).toBeFalsy()
      expect(isCozypackage('react')).toBeFalsy()
      expect(isCozypackage('lodash')).toBeFalsy()
    })
    it('should return True if package is prefix by "cozy-"', () => {
      expect(isCozypackage('cozy-client')).toBeTruthy()
      expect(isCozypackage('cozy-device-helper')).toBeTruthy()
    })
  })
  describe('getPackagesToUpdate', () => {
    it('should return packages that need to be updated', () => {
      const expected = [
        {
          appDepsVersion: '^2.0.0',
          libPeerDepVersion: '>=2.1.3',
          name: 'cozy-pck01',
          needUpdate: true
        },
        {
          appDepsVersion: '^2.0.0',
          libPeerDepVersion: '>2.1.3',
          name: 'cozy-pck02',
          needUpdate: true
        },
        {
          appDepsVersion: '^2.0.0',
          libPeerDepVersion: '=2.1.3',
          name: 'cozy-pck04',
          needUpdate: true
        },
        {
          appDepsVersion: undefined,
          libPeerDepVersion: '>=2.1.3',
          name: 'cozy-pck05',
          needUpdate: true
        },
        {
          appDepsVersion: '2.0.0',
          libPeerDepVersion: '>=2.1.3',
          name: 'pck01',
          needUpdate: true
        },
        {
          appDepsVersion: '2.0.0',
          libPeerDepVersion: '>2.1.3',
          name: 'pck02',
          needUpdate: true
        },
        {
          appDepsVersion: '2.0.0',
          libPeerDepVersion: '=2.1.3',
          name: 'pck04',
          needUpdate: true
        },
        {
          appDepsVersion: undefined,
          libPeerDepVersion: '>=2.1.3',
          name: 'pck05',
          needUpdate: true
        }
      ]

      const res = getPackagesToUpdate(mockLibPackage, mockAppPackage)
      expect(res).toStrictEqual(expected)
    })
  })
  describe('makeUpdatePackagesCommand', () => {
    it('should make correct command to execute', () => {
      const mockPackageToUpdate = [
        { name: 'cozy-pck01', libPeerDepVersion: '>=2.1.3' },
        { name: 'pck01', libPeerDepVersion: '>=2.1.3' }
      ]
      const res = makeUpdatePackagesCommand(mockPackageToUpdate)

      expect(res).toBe('yarn upgrade cozy-pck01@^2.1.3 pck01@2.1.3')
    })
  })
})
