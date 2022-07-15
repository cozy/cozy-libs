import get from 'lodash/get'

import { filterPapersByThemeAndSearchValue, hasItemByLabel } from './helpers'

const locales = {
  items: {
    isp_invoice: 'Facture internet',
    driver_license: 'Permis de conduire',
    phone_invoice: 'Facture téléphonique'
  }
}

const scannerT = x => get(locales, x)

const files = [
  {
    _id: 'file01',
    name: 'Facture internet',
    metadata: { qualification: { label: 'isp_invoice' } },
    updated_at: '2021-01-01:09:00.000000+01:00'
  },
  {
    _id: 'file02',
    name: 'Permis de conduire',
    metadata: { qualification: { label: 'driver_license' } },
    updated_at: '2021-05-01:09:00.000000+01:00'
  },
  {
    _id: 'file03',
    name: 'Facture minitel',
    metadata: { qualification: { label: 'phone_invoice' } },
    updated_at: '2021-11-01:09:00.000000+01:00'
  }
]

describe('filterPapersByThemeAndSearchValue', () => {
  describe('with only theme selected', () => {
    test('when one qualification label matches', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: {
          items: [{ label: 'isp_invoice' }]
        },
        search: '',
        scannerT
      })

      expect(res).toHaveLength(1)
      expect(res).toContain(files[0])
    })

    test('when two qualifiation labels matches', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: {
          items: [{ label: 'isp_invoice' }, { label: 'phone_invoice' }]
        },
        search: '',
        scannerT
      })

      expect(res).toHaveLength(2)
      expect(res).toContain(files[0])
      expect(res).toContain(files[2])
    })
  })

  describe('with only search value', () => {
    test('when names matches', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: '',
        search: 'facture',
        scannerT
      })

      expect(res).toHaveLength(2)
      expect(res).toContain(files[0])
      expect(res).toContain(files[2])
    })

    test('when qualification labels matches', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: '',
        search: 'téléphonique',
        scannerT
      })

      expect(res).toHaveLength(1)
      expect(res).toContain(files[2])
    })
  })

  describe('with theme selected and search value', () => {
    it('should return only the correct files', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: {
          items: [{ label: 'isp_invoice' }]
        },
        search: 'facture',
        scannerT
      })

      expect(res).toHaveLength(1)
      expect(res).toContain(files[0])
    })
  })
})

describe('hasItemByLabel', () => {
  it('should return true', () => {
    const res = hasItemByLabel(
      { items: [{ label: 'isp_invoice' }] },
      'isp_invoice'
    )

    expect(res).toBe(true)
  })

  it('should return false', () => {
    const res = hasItemByLabel(
      { items: [{ label: 'isp_invoice' }] },
      'phone_invoice'
    )

    expect(res).toBe(false)
  })
})
