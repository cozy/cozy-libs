import { makeFileWithBlob } from './makeFileWithBlob'

describe('makeFileWithBlob', () => {
  const blob = new Blob(['data'], { type: 'image/png' })

  it('should return File constructor', () => {
    const res = makeFileWithBlob(blob, {})
    expect(res.constructor).toBe(File)
  })

  it('should set the name provided', () => {
    const res = makeFileWithBlob(blob, { name: 'my file' })
    expect(res.name).toBe('my file.png')
  })

  it('should set a default name', () => {
    const res = makeFileWithBlob(blob)
    expect(res.name).toBe('temp.png')
  })

  it('should return File with original type', () => {
    const res = makeFileWithBlob(blob, {})
    expect(res.type).toBe('image/png')
  })
})
