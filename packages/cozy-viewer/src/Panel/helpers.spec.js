import { format } from 'date-fns'

import { makeHideDivider, getAntivirusStatus, makeDate } from './helpers'

describe('makeDate', () => {
  const date = new Date(2026, 8, 18, 7, 11)

  it('should format an english date with a literal "at"', () => {
    expect(format(date, makeDate('en'))).toBe('Sep 18 2026 at 07:11')
  })

  it('should format a french date', () => {
    expect(format(date, makeDate('fr'))).toBe('18 Sep 2026 à 07:11')
  })
})

describe('getAntivirusStatus', () => {
  const t = jest.fn(key => key)

  it('should return scanning status for pending', () => {
    const file = { antivirus_scan: { status: 'pending' } }
    const res = getAntivirusStatus(file, t)
    expect(res.text).toBe('Viewer.panel.antivirus.scanning')
    expect(res.isError).toBeFalsy()
    expect(res.icon).toBeDefined()
  })

  it('should return scanned status for clean', () => {
    const file = { antivirus_scan: { status: 'clean' } }
    const res = getAntivirusStatus(file, t)
    expect(res.text).toBe('Viewer.panel.antivirus.scanned')
    expect(res.isError).toBeFalsy()
    expect(res.icon).toBeDefined()
  })

  it('should return infected status for infected', () => {
    const file = { antivirus_scan: { status: 'infected' } }
    const res = getAntivirusStatus(file, t)
    expect(res.text).toBe('Viewer.panel.antivirus.infected')
    expect(res.isError).toBeTruthy()
    expect(res.icon).toBeDefined()
  })

  it('should return empty status for unknown status', () => {
    const file = { antivirus_scan: { status: 'unknown' } }
    const res = getAntivirusStatus(file, t)
    expect(res.text).toBeNull()
    expect(res.icon).toBeNull()
  })
})

describe('makeHideDivider', () => {
  describe('should hide the divider', () => {
    it('if contact is the only qualification', () => {
      const res = makeHideDivider([{ name: 'contact' }], 0)

      expect(res).toBeTruthy()
    })

    it('for the last qualification', () => {
      const res = makeHideDivider(
        [{ name: 'contact' }, { name: 'issueDate' }],
        1
      )

      expect(res).toBeTruthy()
    })

    it('for the first qualificaiton if contact is the second and last one', () => {
      const res = makeHideDivider(
        [{ name: 'issueDate' }, { name: 'contact' }],
        0
      )

      expect(res).toBeTruthy()
    })
  })

  describe('should show the divider', () => {
    it('for contact if is the first and not only one qualification', () => {
      const res = makeHideDivider(
        [{ name: 'contact' }, { name: 'issueDate' }],
        0
      )

      expect(res).toBeFalsy()
    })
  })
})
