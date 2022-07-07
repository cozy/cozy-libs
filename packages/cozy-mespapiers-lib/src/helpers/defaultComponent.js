import PapersFab from '../components/PapersFab/PapersFab'

const defaultComponents = {
  PapersFab
}

export const getComponents = components => {
  return {
    PapersFab:
      components?.PapersFab || components?.PapersFab === null
        ? components.PapersFab
        : defaultComponents.PapersFab
  }
}
