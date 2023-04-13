import get from 'lodash/get'
import MockDate from 'mockdate'

import {
  filterPapersByThemeAndSearchValue,
  hasItemByLabel,
  makePapersGroupByQualificationLabel
} from './helpers'

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
    file: {
      _id: 'file01',
      name: 'Facture internet',
      metadata: { qualification: { label: 'isp_invoice' } },
      updated_at: '2021-01-01:09:00.000000+01:00'
    }
  },
  {
    file: {
      _id: 'file02',
      name: 'Permis de conduire',
      metadata: { qualification: { label: 'driver_license' } },
      updated_at: '2021-05-01:09:00.000000+01:00'
    },
    contact: 'Alice Durand'
  },
  {
    file: {
      _id: 'file03',
      name: 'Facture minitel',
      metadata: { qualification: { label: 'phone_invoice' } },
      updated_at: '2021-11-01:09:00.000000+01:00'
    }
  },
  {
    file: {
      _id: 'file04',
      name: "Dernier avis d'imposition",
      metadata: { qualification: { label: 'tax_notice' } },
      updated_at: '2022-07-01:09:00.000000+01:00'
    },
    contact: 'Alice et Bob Durand'
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

    test('when contact matches', () => {
      const res = filterPapersByThemeAndSearchValue({
        files,
        theme: '',
        search: 'alice d',
        scannerT
      })

      expect(res).toHaveLength(2)
      expect(res).toContain(files[1])
      expect(res).toContain(files[3])
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

describe('makePapersGroupByQualificationLabel', () => {
  beforeEach(() => {
    MockDate.set('2023-12-01:09:00.000000+01:00')
  })
  afterEach(() => {
    MockDate.reset()
  })
  const fileList = [
    {
      _id: 'file01',
      name: "Avis d'imposition 01",
      metadata: { qualification: { label: 'tax_notice' } },
      created_at: '2023-04-01:09:00.000000+01:00'
    },
    {
      _id: 'file02',
      name: 'Facture internet 01',
      metadata: { qualification: { label: 'isp_invoice' } },
      created_at: '2023-01-01:09:00.000000+01:00'
    },
    {
      _id: 'file03',
      name: "Avis d'imposition 02",
      metadata: { qualification: { label: 'tax_notice' } },
      created_at: '2023-02-01:09:00.000000+01:00'
    },
    {
      _id: 'file04',
      name: 'Facture internet 02',
      metadata: { qualification: { label: 'isp_invoice' } },
      created_at: '2023-06-01:09:00.000000+01:00'
    }
  ]

  it('should return the correct object with files grouped by qualification label and sort by their created_at date', () => {
    const res = makePapersGroupByQualificationLabel(fileList)

    expect(res).toEqual({
      isp_invoice: [fileList[1], fileList[3]],
      tax_notice: [fileList[0], fileList[2]]
    })
  })
})
