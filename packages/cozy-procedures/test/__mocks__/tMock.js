const tMock = (msgId, args) => `${msgId} ${args ? JSON.stringify(args) : ''}`

export default tMock
