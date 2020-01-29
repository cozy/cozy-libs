const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

export default assert
