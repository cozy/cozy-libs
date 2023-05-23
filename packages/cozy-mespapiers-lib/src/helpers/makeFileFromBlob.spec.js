import { makeFileFromBlob } from './makeFileFromBlob'

describe('makeFileFromBlob', () => {
  const blob = new Blob(['data'], { type: 'image/png' })

  it('should return File constructor', () => {
    const res = makeFileFromBlob(blob, {})
    expect(res.constructor).toBe(File)
  })

  it('should set the name provided', () => {
    const res = makeFileFromBlob(blob, { name: 'my file' })
    expect(res.name).toBe('my file.png')
  })

  it('should set a default name', () => {
    const res = makeFileFromBlob(blob)
    expect(res.name).toBe('temp.png')
  })

  it('should return File with original type', () => {
    const res = makeFileFromBlob(blob, {})
    expect(res.type).toBe('image/png')
  })
})
