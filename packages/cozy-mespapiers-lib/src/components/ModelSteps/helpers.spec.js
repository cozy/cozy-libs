import {
  isFileAlreadySelected,
  makeBase64FromFile,
  makeFileFromBase64,
  getFormDataFilesForOcr
} from './helpers'

describe('ModalSteps helpers', () => {
  describe('isFileAlreadySelected', () => {
    it('should return true if the File is already selected in the same step', () => {
      const file = new File([], 'abc.pdf')
      const formData = {
        data: [{ stepIndex: 1, file }]
      }
      const currentStepIndex = 1
      const currentFile = file

      expect(
        isFileAlreadySelected(formData, currentStepIndex, currentFile)
      ).toBe(true)
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

      expect(
        isFileAlreadySelected(formData, currentStepIndex, currentFile)
      ).toBe(false)
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

  describe('makeBase64FromFile', () => {
    it('returns a base64 string for a given file', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const base64String = await makeBase64FromFile(file)

      expect(base64String).toMatch(
        /^data:text\/plain;base64,[a-zA-Z0-9+/]+={0,2}$/
      )
    })

    it('returns a base64 string for a given file', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const base64String = await makeBase64FromFile(file, { prefix: false })

      expect(base64String).not.toMatch(
        /^data:text\/plain;base64,[a-zA-Z0-9+/]+={0,2}$/
      )
    })

    it('rejects with an error if the file cannot be read', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' })
      const invalidFile = { ...file, size: -1 }

      await expect(makeBase64FromFile(invalidFile)).rejects.toThrow()
    })
  })

  describe('getFilesForOcr', () => {
    it('should return an empty array if no files', () => {
      const formData = {
        metadata: {},
        data: [],
        contacts: []
      }
      const filesForOcr = getFormDataFilesForOcr(formData, undefined)
      expect(filesForOcr).toEqual([])
    })
    it('should return an array with a file', () => {
      const formData = {
        metadata: {},
        data: [
          { file: { name: '001.pdf' }, fileMetadata: { page: undefined } }
        ],
        contacts: []
      }
      const filesForOcr = getFormDataFilesForOcr(formData, undefined)
      expect(filesForOcr).toEqual([{ name: '001.pdf' }])
    })
    it('should return an array with two file', () => {
      const formData = {
        metadata: {},
        data: [
          { file: { name: '001.pdf' }, fileMetadata: { page: 'front' } },
          { file: { name: '002.pdf' }, fileMetadata: { page: 'back' } }
        ],
        contacts: []
      }
      const filesForOcr = getFormDataFilesForOcr(formData)
      expect(filesForOcr).toEqual([{ name: '001.pdf' }, { name: '002.pdf' }])
    })
    it('should return an array with the last file rotated', () => {
      const formData = {
        metadata: {},
        data: [
          { file: { name: '001.pdf' }, fileMetadata: { page: 'front' } },
          { file: { name: '002.pdf' }, fileMetadata: { page: 'back' } }
        ],
        contacts: []
      }
      const filesForOcr = getFormDataFilesForOcr(formData, {
        name: '002_rotated.pdf'
      })
      expect(filesForOcr).toEqual([
        { name: '001.pdf' },
        { name: '002_rotated.pdf' }
      ])
    })
  })
})
