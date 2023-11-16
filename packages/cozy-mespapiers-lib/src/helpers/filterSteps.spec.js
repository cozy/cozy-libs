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

  it('should return step with "isDisplayed" as "ocr" or "all" when OCR is activated', async () => {
    isFlagshipOCRAvailable.mockReturnValue(true)
    const stepsFilterd = await filterSteps(steps, { call: jest.fn() })
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
    const stepsFilterd = await filterSteps(steps)
    expect(stepsFilterd).toStrictEqual([
      { model: 'scan', isDisplayed: 'all' },
      { model: 'information', isDisplayed: 'randomValue' },
      { model: 'contact' }
    ])
  })
})
