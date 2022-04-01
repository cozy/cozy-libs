import People from 'cozy-ui/transpiled/react/Icons/People'

import { findIconByLabel } from 'src/helpers/findIconByLabel'

describe('findIconByLabel', () => {
  it('should return correct Icon if label is found', () => {
    const result = findIconByLabel('national_id_card')

    expect(result).toBe(People)
  })

  it('should return nothing if label is not found', () => {
    const result = findIconByLabel('fake_label')

    expect(result).toBe(undefined)
  })
})
