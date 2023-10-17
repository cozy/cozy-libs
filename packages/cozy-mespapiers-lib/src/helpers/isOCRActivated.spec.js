import { isFlagshipApp } from 'cozy-device-helper'
import flag from 'cozy-flags'

import { isOCRActivated } from './isOCRActivated'

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isFlagshipApp: jest.fn()
}))
jest.mock('cozy-flags')

describe('isOCRActivated', () => {
  const stepsWithOCR = [
    {
      model: 'scan',
      text: 'PaperJSON.generic.singlePage.text',
      isDisplayed: 'all'
    },
    {
      model: 'information',
      text: 'PaperJSON.card.number.inputLabel',
      isDisplayed: 'ocr'
    },
    { model: 'contact', text: 'PaperJSON.generic.owner.text' }
  ]

  const stepsWithoutOCR = [
    { model: 'scan', text: 'PaperJSON.generic.singlePage.text' },
    {
      model: 'information',
      text: 'PaperJSON.card.number.inputLabel'
    },
    { model: 'contact', text: 'PaperJSON.generic.owner.text' }
  ]

  const setup = ({
    flagship = false,
    enabled = false,
    compatible = false
  } = {}) => {
    flag.mockReturnValue(enabled)
    isFlagshipApp.mockReturnValue(flagship)
    return isOCRActivated(compatible ? stepsWithOCR : stepsWithoutOCR)
  }

  it('should return false if any criteria is missing (flagship, compatible, enabled)', () => {
    const res = setup()
    expect(res).toBe(false)
  })

  it('should return true if meet all criteria (flagship, compatible, enabled)', () => {
    const res = setup({
      flagship: true,
      enabled: true,
      compatible: true
    })
    expect(res).toBe(true)
  })

  it('should return false if it is not on the flagship app', () => {
    const res = setup({
      flagship: false,
      enabled: true,
      compatible: true
    })
    expect(res).toBe(false)
  })

  it('should return false if mespapiers.ocr.enabled is not true', () => {
    const res = setup({
      flagship: true,
      enabled: false,
      compatible: true
    })
    expect(res).toBe(false)
  })

  it('should return false if any step is compatible with ocr', () => {
    const res = setup({
      flagship: true,
      enabled: true,
      compatible: false
    })
    expect(res).toBe(false)
  })
})
