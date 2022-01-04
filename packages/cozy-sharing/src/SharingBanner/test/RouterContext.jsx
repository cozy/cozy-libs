import React, { useContext } from 'react'
import { withRouter } from 'react-router'

export const RouterContext = React.createContext()

export const RouterContextProvider = withRouter(
  ({ children, router, params, location, routes }) => (
    <RouterContext.Provider value={{ router, params, location, routes }}>
      {children}
    </RouterContext.Provider>
  )
)

export const useRouter = () => useContext(RouterContext)
