const tMock = (msgId, args) => {
  return `${msgId} ${args ? JSON.stringify(args) : ''}`
}

export default tMock
