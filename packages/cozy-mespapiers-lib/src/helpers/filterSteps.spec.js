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

  it('should return step with "isDisplayed" as "ocr" or "all" when OCR is activated', () => {
    isOCRActivated.mockReturnValue(true)
    expect(filterSteps(steps)).toStrictEqual([
      { model: 'scan', isDisplayed: 'all' },
      {
        model: 'information',
        isDisplayed: 'ocr'
      }
    ])
  })

  it('should return step with "isDisplayed" as "undefined" or "all" when OCR is desactivated', () => {
    isOCRActivated.mockReturnValue(false)
    expect(filterSteps(steps)).toStrictEqual([
      { model: 'scan', isDisplayed: 'all' },
      { model: 'information', isDisplayed: 'randomValue' },
      { model: 'contact' }
    ])
  })
})
