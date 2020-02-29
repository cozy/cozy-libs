const tabSpecs = {
  data: {
    errorShouldBeDisplayed: (error, flowState) =>
      !flowState.running && error && !error.isLoginError()
  },
  configuration: {
    errorShouldBeDisplayed: (error, flowState) =>
      !flowState.running && error && error.isLoginError()
  }
}

export default tabSpecs
