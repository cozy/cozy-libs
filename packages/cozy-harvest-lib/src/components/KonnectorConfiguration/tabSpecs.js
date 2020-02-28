const tabSpecs = {
  data: {
    errorShouldBeDisplayed: error => error && !error.isLoginError()
  },
  configuration: {
    errorShouldBeDisplayed: error => error && error.isLoginError()
  }
}

export default tabSpecs
