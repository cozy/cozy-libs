import React, { createContext } from 'react'
import { PageFooter, PageLayout, PageContent } from 'cozy-ui/transpiled/react'

const ProcedureOptionsContext = createContext({})

const DEFAULT_OPTIONS = {
  components: {
    PageLayout,
    PageFooter,
    PageContent
  }
}

export const optionsProvider = (
  Component,
  procedureOptions = DEFAULT_OPTIONS
) => {
  const Wrapped = props => {
    return (
      <ProcedureOptionsContext.Provider value={procedureOptions}>
        <Component {...props} />
      </ProcedureOptionsContext.Provider>
    )
  }
  Wrapped.displayName = `procedureOptionsProvider(${Component.displayName ||
    Component.name})`
  return Wrapped
}

export const optionsConsumer = Component => {
  const Wrapped = props => (
    <ProcedureOptionsContext.Consumer>
      {options => <Component {...options} {...props} />}
    </ProcedureOptionsContext.Consumer>
  )
  Wrapped.displayName = `procedureOptionsConsumer(${Component.displayName ||
    Component.name})`
  return Wrapped
}
