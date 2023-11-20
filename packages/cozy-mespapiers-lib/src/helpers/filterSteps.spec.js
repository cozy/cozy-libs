import { act } from '@testing-library/react'

import { filterSteps } from './filterSteps'
import { isFlagshipOCRAvailable } from './isFlagshipOCRAvailable'

jest.mock('./isFlagshipOCRAvailable', () => ({
  isFlagshipOCRAvailable: jest.fn()
}))

describe('filterSteps', () => {
  const steps = [
    { model: 'scan', isDisplayed: 'all' },
    {
      model: 'information',
      isDisplayed: 'ocr'
    },
    { model: 'information', isDisplayed: 'randomValue' },
    { model: 'contact' }
  ]

  it('should return step with "isDisplayed" as "ocr" or "all" when OCR is activated & and there is no "fromFlagshipUpload" query param', async () => {
    const webviewIntent = { call: jest.fn() }
    const fromFlagshipUpload = false
    isFlagshipOCRAvailable.mockReturnValue(true)
    const stepsFilterd = await filterSteps({
      steps,
      webviewIntent,
      fromFlagshipUpload
    })
    act(() => {
      expect(stepsFilterd).toStrictEqual([
        { model: 'scan', isDisplayed: 'all' },
        {
          model: 'information',
          isDisplayed: 'ocr'
        }
      ])
    })
  })

  it('should return step with "isDisplayed" as "undefined" or "all" when OCR is desactivated', async () => {
    isFlagshipOCRAvailable.mockReturnValue(false)
    const webviewIntent = { call: jest.fn() }
    const fromFlagshipUpload = false
    const stepsFilterd = await filterSteps({
      steps,
      webviewIntent,
      fromFlagshipUpload
    })
    expect(stepsFilterd).toStrictEqual([
      { model: 'scan', isDisplayed: 'all' },
      { model: 'information', isDisplayed: 'randomValue' },
      { model: 'contact' }
    ])
  })

  it('should return step with "isDisplayed" as "undefined" or "all" when "fromFlagshipUpload" query parameter is true', async () => {
    isFlagshipOCRAvailable.mockReturnValue(true)
    const webviewIntent = { call: jest.fn() }
    const fromFlagshipUpload = true
    const stepsFilterd = await filterSteps({
      steps,
      webviewIntent,
      fromFlagshipUpload
    })
    expect(stepsFilterd).toStrictEqual([
      { model: 'scan', isDisplayed: 'all' },
      { model: 'information', isDisplayed: 'randomValue' },
      { model: 'contact' }
    ])
  })
})
