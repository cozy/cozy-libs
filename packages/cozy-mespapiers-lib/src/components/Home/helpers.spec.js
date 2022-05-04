import { filterPapersByThemeAndSearchValue, hasItemByLabel } from './helpers'

const files = [
  {
    _id: 'file01',
    name: 'Facture internet',
    metadata: { qualification: { label: 'isp_invoice' } }
  },
  {
    _id: 'file02',
    name: 'Permis de conduire',
    metadata: { qualification: { label: 'driver_license' } }
  },
  {
    _id: 'file03',
    name: 'Facture téléphonique',
    metadata: { qualification: { label: 'phone_invoice' } }
  }
]

describe('filterPapersByThemeAndSearchValue', () => {
  describe('with only theme selected', () => {
    it('should return only the correct files with one qualification label', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: {
          items: [{ label: 'isp_invoice' }]
        },
        search: ''
      })

      expect(res).toHaveLength(1)
      expect(res).toContain(files[0])
    })

    it('should return only the correct files with two qualifiation labels', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: {
          items: [{ label: 'isp_invoice' }, { label: 'phone_invoice' }]
        },
        search: ''
      })

      expect(res).toHaveLength(2)
      expect(res).toContain(files[0])
      expect(res).toContain(files[2])
    })
  })

  describe('with only search value', () => {
    it('should return only the correct files with search value', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: '',
        search: 'facture'
      })

      expect(res).toHaveLength(2)
      expect(res).toContain(files[0])
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
        search: 'facture'
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
