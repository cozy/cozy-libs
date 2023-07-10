import React from 'react'

const ComponentsPropsContext = React.createContext()

/**
 * @typedef {object} ComponentsProps
 * @property {object} CannotConnectModal - Name of component
 * @property {object} CannotConnectModal.extraContent - Additional content
 */

/**
 * @param {object} param
 * @param {JSX.Element} param.children
 * @param {ComponentsProps | undefined} param.ComponentsProps
 * @returns
 */
const ComponentsPropsProvider = ({ children, ComponentsProps }) => {
  return (
    <ComponentsPropsContext.Provider value={{ ComponentsProps }}>
      {children}
    </ComponentsPropsContext.Provider>
  )
}

export const useComponentsProps = () => {
  const componentsProps = React.useContext(ComponentsPropsContext)
  if (!componentsProps) {
    throw new Error(
      'ComponentsPropsContext must be used within a ComponentsPropsProvider'
    )
  }

  return componentsProps
}

export default ComponentsPropsProvider
