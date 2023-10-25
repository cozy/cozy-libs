import { act } from '@testing-library/react'

import { filterSteps } from './filterSteps'
import { isOCRActivated } from './isOCRActivated'

jest.mock('./isOCRActivated', () => ({
  isOCRActivated: jest.fn()
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
    isOCRActivated.mockReturnValue(true)
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
    isOCRActivated.mockReturnValue(false)
    const stepsFilterd = await filterSteps(steps)
    expect(stepsFilterd).toStrictEqual([
      { model: 'scan', isDisplayed: 'all' },
      { model: 'information', isDisplayed: 'randomValue' },
      { model: 'contact' }
    ])
  })
})
