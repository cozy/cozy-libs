module.exports = {
  OpenSharingLinkButton: jest.fn(() => null),
  useSharingInfos: jest.fn(() => ({})),
  useSharingContext: jest.fn(() => ({})),
  SharingContext: {
    Provider: ({ children }) => children
  }
}
