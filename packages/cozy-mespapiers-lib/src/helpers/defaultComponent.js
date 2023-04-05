import ForwardFab from '../components/ForwardFab/ForwardFab'
import Onboarding from '../components/Onboarding/Onboarding'
import PapersFab from '../components/PapersFab/PapersFab'

const defaultComponents = {
  ForwardFab,
  PapersFab,
  Onboarding
}

const getComponentByName = (components, name) => {
  return components?.[name] || components?.[name] === null
    ? components[name]
    : defaultComponents[name]
}

export const getComponents = components => {
  return {
    ForwardFab: getComponentByName(components, 'ForwardFab'),
    PapersFab: getComponentByName(components, 'PapersFab'),
    Onboarding: getComponentByName(components, 'Onboarding')
  }
}
