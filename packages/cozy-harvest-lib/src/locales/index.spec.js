import { getBoundT } from './index'

describe('bound t', () => {
  it('should be possible to get a t bound to harvest locales', () => {
    const t = getBoundT('en')
    expect(t('card.launchTrigger.button.label')).toBe('Run again now')
  })
})
