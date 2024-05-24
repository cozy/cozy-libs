import ForwardFab from '../components/ForwardFab/ForwardFab'
import PapersFab from '../components/PapersFab/PapersFab'

const defaultComponents = {
  ForwardFab,
  PapersFab
}

const getComponentByName = (components, name) => {
  return components?.[name] || components?.[name] === null
    ? components[name]
    : defaultComponents[name]
}

export const getComponents = components => {
  return {
    ForwardFab: getComponentByName(components, 'ForwardFab'),
    PapersFab: getComponentByName(components, 'PapersFab')
  }
}
