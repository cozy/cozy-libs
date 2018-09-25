module.exports = {
  cozyClient: {
    data: {
      defineIndex: jest.fn().mockResolvedValue({ name: 'index' }),
      query: jest.fn().mockResolvedValue([]),
      updateAttributes: jest.fn(),
      create: jest.fn()
    },
    fetchJSON: jest.fn().mockReturnValue({ rows: [] })
  }
}
