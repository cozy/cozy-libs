module.exports = {
  WebviewService: jest.fn(),
  create: jest.fn(),
  useWebviewIntent: jest.fn(() => ({
    call: jest.fn()
  }))
}
