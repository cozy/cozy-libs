import People from 'cozy-ui/transpiled/react/Icons/People'

const identityLabels = ['national_id_card', 'passport']

export const findIconByLabel = label => {
  if (identityLabels.includes(label)) return People
}
