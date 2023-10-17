import { isOCRCompliant } from './isOCRCompliant'

describe('isOCRCompliant', () => {
  it('should return "true" if the "isDisplayed" as "all" or "ocr" value in some step', () => {
    const steps = [
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
    expect(isOCRCompliant(steps)).toBe(true)
  })
  it('should return "false" if the "isDisplayed" attribute does not exist in any step', () => {
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
