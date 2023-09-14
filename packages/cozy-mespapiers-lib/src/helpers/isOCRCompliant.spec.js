import { isOCRCompliant } from './isOCRCompliant'

describe('isOCRCompliant', () => {
  it('should return true if the ocr attribute exist in some step', () => {
    const steps = [
      { model: 'scan', text: 'PaperJSON.generic.singlePage.text', ocr: 'both' },
      {
        model: 'information',
        text: 'PaperJSON.card.number.inputLabel',
        ocr: 'only'
      },
      { model: 'contact', text: 'PaperJSON.generic.owner.text' }
    ]
    expect(isOCRCompliant(steps)).toBe(true)
  })
  it('should return false if the ocr attribute does not exist in any step', () => {
    const steps = [
      { model: 'scan', text: 'PaperJSON.generic.singlePage.text' },
      {
        model: 'information',
        text: 'PaperJSON.card.number.inputLabel'
      },
      { model: 'contact', text: 'PaperJSON.generic.owner.text' }
    ]
    expect(isOCRCompliant(steps)).toBe(false)
  })
})
