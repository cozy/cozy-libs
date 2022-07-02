"use strict";

var _getThumbnailLink = require("./getThumbnailLink");

var mockClient = {
  getStackClient: jest.fn().mockReturnValue({
    uri: 'abcd/'
  })
};
var mockPDFFile = {
  _id: '123',
  class: 'pdf',
  links: {
    icon: 'urlPDFThumbnail'
  }
};
var mockImageFile = {
  _id: '456',
  class: 'image',
  links: {
    small: 'urlImageThumbnail'
  }
};
var mockOtherFile = {
  _id: '456',
  class: 'other'
};
describe('getThumbnailLink', function () {
  it('should return URL of PDF thumbnail', function () {
    var result = (0, _getThumbnailLink.getThumbnailLink)(mockClient, mockPDFFile);
    expect(result).toBe('abcd/urlPDFThumbnail');
  });
  it('should return URL of image thumbnail', function () {
    var result = (0, _getThumbnailLink.getThumbnailLink)(mockClient, mockImageFile);
    expect(result).toBe('abcd/urlImageThumbnail');
  });
  it('should return null', function () {
    var result = (0, _getThumbnailLink.getThumbnailLink)(mockClient, mockOtherFile);
    expect(result).toBe(null);
  });
});