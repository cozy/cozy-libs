import { isFileAlreadySelected } from './helpers'

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

  it('should return true if the Blob is already selected in the same step', () => {
    const blob = new Blob([])
    blob.id = '001'
    const formData = {
      data: [{ stepIndex: 1, file: blob }]
    }
    const currentStepIndex = 1
    const currentFile = blob

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

  it('should return false if the Blob is not already selected in the same step', () => {
    const blob = new Blob([])
    blob.id = '001'
    const formData = {
      data: [{ stepIndex: 1, file: blob }]
    }
    const currentStepIndex = 1
    const currentFile = new Blob([])
    currentFile.id = '002'

    expect(isFileAlreadySelected(formData, currentStepIndex, currentFile)).toBe(
      false
    )
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
