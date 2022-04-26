import { makeActionVariant } from './utils'
import { download, forward } from './Actions'

jest.mock('./Actions')

describe('makeActionVariant', () => {
  it('should have "download" action on desktop', () => {
    global.navigator.share = null

    expect(makeActionVariant()).toStrictEqual([download])
  })

  it('should have "download" & "Forward" action (in this order) on mobile', () => {
    global.navigator.share = () => {}

    expect(makeActionVariant()).toStrictEqual([download, forward])
  })
})
