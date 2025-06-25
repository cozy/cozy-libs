import { sanitizeChatContent } from './helpers'

describe('sanitizeChatContent', () => {
  it('should return empty string for empty content', () => {
    expect(sanitizeChatContent('')).toBe('')
    expect(sanitizeChatContent(null)).toBe('')
    expect(sanitizeChatContent(undefined)).toBe('')
  })

  it('should return string if no special tags', () => {
    const text = 'How you doing, here no ref.'
    expect(sanitizeChatContent(text)).toBe(text)
  })

  it('should remove tags REF.../REF', () => {
    const text = 'Before REFdoc_1/REF after'
    expect(sanitizeChatContent(text)).toBe('Before after')
  })

  it('should remove tags [REF]...[/REF]', () => {
    const text = 'Before [REF]doc_1[/REF] after'
    expect(sanitizeChatContent(text)).toBe('Before after')
  })

  it('should remove mixed REF tags ', () => {
    const text = 'A REF.../REF B [REF]...[/REF] C REF.../REF D'
    expect(sanitizeChatContent(text)).toBe('A B C D')
  })

  it('should remove [tags]', () => {
    const text = 'Here is a doc [doc_42] and some texte'
    expect(sanitizeChatContent(text)).toBe('Here is a doc and some texte')
  })

  it('should not remove simple REF or [REF]', () => {
    const text = 'REF not closed [REF]not closed either'
    expect(sanitizeChatContent(text)).toBe(text)
  })
  it('should not remove lowercase ref', () => {
    const text = 'before refdoc_1/ref after'
    expect(sanitizeChatContent(text)).toBe(text)
  })
})
