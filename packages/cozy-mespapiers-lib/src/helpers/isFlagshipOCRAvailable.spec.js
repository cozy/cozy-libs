import { isFlagshipApp as isFlagshipAppFn } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { isFlagshipOCRAvailable } from './isFlagshipOCRAvailable'

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isFlagshipApp: jest.fn()
}))
jest.mock('cozy-flags')

describe('isFlagshipOCRAvailable', () => {
  const setup = ({
    isFlagshipApp = false,
    flagEnabled = false,
    isFlagshipAppOcrAvailable = false
  } = {}) => {
    const webviewIntent = {
      call: jest.fn().mockResolvedValue(isFlagshipAppOcrAvailable)
    }
    flag.mockReturnValue(flagEnabled)
    isFlagshipAppFn.mockReturnValue(isFlagshipApp)
    return isFlagshipOCRAvailable(webviewIntent)
  }

  it('should return true if meet all criteria (isFlagshipApp, isFlagshipAppOcrAvailable, flagEnabled)', async () => {
    const res = await setup({
      isFlagshipApp: true,
      flagEnabled: true,
      isFlagshipAppOcrAvailable: true
    })
    expect(res).toBe(true)
  })

  it('should return false if it is not on the flagship app', async () => {
    const res = await setup({
      isFlagshipApp: false,
      flagEnabled: true,
      isFlagshipAppOcrAvailable: true
    })
    expect(res).toBe(false)
  })

  it('should return false if flag "mespapiers.ocr.enabled" is not true', async () => {
    const res = await setup({
      isFlagshipApp: true,
      flagEnabled: false,
      isFlagshipAppOcrAvailable: true
    })
    expect(res).toBe(false)
  })

  it('should return false if any step is compatible with ocr', async () => {
    const res = await setup({
      isFlagshipApp: true,
      flagEnabled: true,
      isFlagshipAppOcrAvailable: false
    })
    expect(res).toBe(false)
  })
})
