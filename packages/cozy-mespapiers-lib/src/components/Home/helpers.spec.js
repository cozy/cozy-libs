import { filterPapersByTheme, hasItemByLabel } from './helpers'

const files = [
  { _id: 'file01', metadata: { qualification: { label: 'isp_invoice' } } },
  { _id: 'file02', metadata: { qualification: { label: 'driver_license' } } },
  { _id: 'file03', metadata: { qualification: { label: 'phone_invoice' } } }
]

describe('filterPapersByTheme', () => {
  it('should return only the correct files', () => {
    const res = filterPapersByTheme(files, {
      items: [{ label: 'isp_invoice' }]
    })

    expect(res).toHaveLength(1)
    expect(res).toContain(files[0])
  })

  it('should return only the correct files', () => {
    const res = filterPapersByTheme(files, {
      items: [{ label: 'isp_invoice' }, { label: 'phone_invoice' }]
    })

    expect(res).toHaveLength(2)
    expect(res).toContain(files[0])
    expect(res).toContain(files[2])
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
