import { isFileAlreadySelected, makeFileFromBase64 } from './helpers'

describe('isFileAlreadySelected', () => {
  it('should return true if the File is already selected in the same step', () => {
    const file = new File([], 'abc.pdf')
    const formData = {
      data: [{ stepIndex: 1, file }]
    }
    const currentStepIndex = 1
    const currentFile = file

    expect(isFileAlreadySelected(formData, currentStepIndex, currentFile)).toBe(
      true
    )
  })

  it('should return false if the file is not already selected in the same step', () => {
    const file01 = new File([], 'abc.pdf', { lastModified: 123456789 })
    const formData = {
      data: [{ stepIndex: 1, file: file01 }]
    }
    const currentStepIndex = 1
    const currentFile01 = new File([], 'abc.pdf', { lastModified: 987654321 })
    const currentFile02 = new File([], 'xyz.pdf', { lastModified: 123456789 })

    expect(
      isFileAlreadySelected(formData, currentStepIndex, currentFile01)
    ).toBe(false)
    expect(
      isFileAlreadySelected(formData, currentStepIndex, currentFile02)
    ).toBe(false)
  })

  it('should return false if the File is already selected in another step', () => {
    const file = new File([], 'abc.pdf')
    const formData = {
      data: [{ stepIndex: 1, file }]
    }
    const currentStepIndex = 2
    const currentFile = file

    expect(isFileAlreadySelected(formData, currentStepIndex, currentFile)).toBe(
      false
    )
  })
})

describe('makeFileFromBase64', () => {
  it('should return null if no source', () => {
    const file = makeFileFromBase64({
      name: 'logo.png',
      type: 'image/png'
    })
    expect(file).toBe(null)
  })

  it('should return null if no name', () => {
    const file = makeFileFromBase64({
      source: 'iVBORw0KGgoAAAANSUhEUgAAAZAA',
      type: 'image/png'
    })
    expect(file).toBe(null)
  })

  it('should return null if no type', () => {
    const file = makeFileFromBase64({
      source: 'iVBORw0KGgoAAAANSUhEUgAAAZAA',
      name: 'logo.png'
    })
    expect(file).toBe(null)
  })

  it('should return a File object if source contains "data:...;base64,"', () => {
    const file = makeFileFromBase64({
      source: 'data:type/ext;base64,iVBORw0KGgoAAAANSUhEUgAAAZAA',
      name: 'logo.png',
      type: 'image/png'
    })
    expect(file).toBeInstanceOf(File)
  })

  it('should return a File object', () => {
    const file = makeFileFromBase64({
      source: 'iVBORw0KGgoAAAANSUhEUgAAAZAA',
      name: 'logo.png',
      type: 'image/png'
    })
    expect(file).toBeInstanceOf(File)
  })

  it('should return a File object with the right name', () => {
    const file = makeFileFromBase64({
      source: 'iVBORw0KGgoAAAANSUhEUgAAAZAA',
      name: 'logo.png',
      type: 'image/png'
    })
    expect(file.name).toBe('logo.png')
  })

  it('should return a File object with the right type', () => {
    const file = makeFileFromBase64({
      source: 'iVBORw0KGgoAAAANSUhEUgAAAZAA',
      name: 'logo.png',
      type: 'image/png'
    })
    expect(file.type).toBe('image/png')
  })
})
