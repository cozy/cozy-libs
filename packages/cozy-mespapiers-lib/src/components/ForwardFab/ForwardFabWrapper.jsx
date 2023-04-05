import { cloneElement } from 'react'
import { useNavigate } from 'react-router-dom'

const ForwardFabWrapper = ({ children }) => {
  const navigate = useNavigate()

  if (!children) return null

  const ForwardFabOverrided = cloneElement(children, {
    onClick: () => navigate(`/paper/multiselect`)
  })
  return ForwardFabOverrided
}

export default ForwardFabWrapper
