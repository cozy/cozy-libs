import React, { useContext } from 'react'
import { useLocation, useParams } from 'react-router-dom'

export const RouterContext = React.createContext()

export const RouterContextProvider = ({ children }) => {
  const location = useLocation()
  const params = useParams()

  return (
    <RouterContext.Provider value={{ params, location }}>
      {children}
    </RouterContext.Provider>
  )
}

export const useRouter = () => {
  return useContext(RouterContext)
}
