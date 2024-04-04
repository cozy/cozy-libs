import MockDate from 'mockdate'

import { hasItemByLabel, makePapersGroupByQualificationLabel } from './helpers'

describe('hasItemByLabel', () => {
  it('should return true', () => {
    const res = hasItemByLabel(
      [{ items: [{ label: 'isp_invoice' }] }],
      'isp_invoice'
    )

    expect(res).toBe(true)
  })

  it('should return false', () => {
    const res = hasItemByLabel(
      [{ items: [{ label: 'isp_invoice' }] }],
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
