import PapersFab from '../components/PapersFab/PapersFab'
import Onboarding from '../components/Onboarding/Onboarding'

const defaultComponents = {
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
    PapersFab: getComponentByName(components, 'PapersFab'),
    Onboarding: getComponentByName(components, 'Onboarding')
  }
}
