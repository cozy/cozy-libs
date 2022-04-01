import { getThumbnailLink } from 'src/utils/getThumbnailLink'

const mockClient = {
  getStackClient: jest.fn().mockReturnValue({ uri: 'abcd/' })
}
const mockPDFFile = {
  _id: '123',
  class: 'pdf',
  links: {
    icon: 'urlPDFThumbnail'
  }
}
const mockImageFile = {
  _id: '456',
  class: 'image',
  links: {
    small: 'urlImageThumbnail'
  }
}
const mockOtherFile = {
  _id: '456',
  class: 'other'
}

describe('getThumbnailLink', () => {
  it('should return URL of PDF thumbnail', () => {
    const result = getThumbnailLink(mockClient, mockPDFFile)

    expect(result).toBe('abcd/urlPDFThumbnail')
  })

  it('should return URL of image thumbnail', () => {
    const result = getThumbnailLink(mockClient, mockImageFile)

    expect(result).toBe('abcd/urlImageThumbnail')
  })

  it('should return null', () => {
    const result = getThumbnailLink(mockClient, mockOtherFile)

    expect(result).toBe(null)
  })
})
