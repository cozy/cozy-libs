import { filterSteps } from './filterSteps'
import { isOCRActivated } from './isOCRActivated'

jest.mock('./isOCRActivated', () => ({
  isOCRActivated: jest.fn()
}))

describe('filterSteps', () => {
  const steps = [
    { model: 'scan', ocr: 'both' },
    {
      model: 'information',
      ocr: 'only'
    },
    { model: 'information', ocr: 'randomValue' },
    { model: 'contact' }
  ]

  it('should return step with ocr as only or both when OCR is activated', () => {
    isOCRActivated.mockReturnValue(true)
    expect(filterSteps(steps)).toStrictEqual([
      { model: 'scan', ocr: 'both' },
      {
        model: 'information',
        ocr: 'only'
      }
    ])
  })

  it('should return step with ocr as undefined or both when OCR is desactivated', () => {
    isOCRActivated.mockReturnValue(false)
    expect(filterSteps(steps)).toStrictEqual([
      { model: 'scan', ocr: 'both' },
      { model: 'information', ocr: 'randomValue' },
      { model: 'contact' }
    ])
  })
})
