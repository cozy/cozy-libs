export default  (arg: string) => {
  switch (arg) {
    case 'harvest.inappconnectors.enabled':
      return true
    default:
      console.warn(`Flag ${arg} is not mocked`)
      return false
  }
}