import fetch from 'node-fetch'

import { MattermostReporter } from './index'

jest.mock('node-fetch')

const messages = [
  { message: 'Repository: cozy/cozy-drive' },
  {
    severity: 'info',
    type: 'dep-up-to-date',
    message: 'cozy-ui: 62.1.2, last is 62.1.4'
  },
  {
    severity: 'warn',
    type: 'dep-up-to-date',
    message: 'cozy-client: ^27.19.4, last is 27.22.0'
  },
  {
    severity: 'error',
    type: 'dep-up-to-date',
    message: 'cozy-realtime: 3.13.0, last is 4.0.5'
  },
  { message: 'Repository: cozy/cozy-banks' },
  {
    severity: 'success',
    type: 'dep-up-to-date',
    message: 'cozy-ui: ^62.1.4, last is 62.1.4'
  },
  {
    severity: 'warn',
    type: 'dep-up-to-date',
    message: 'cozy-client: ^27.17.0, last is 27.22.0'
  },
  {
    severity: 'error',
    type: 'dep-up-to-date',
    message: 'cozy-realtime: 3.11.0, last is 4.0.5'
  }
]

describe('mattermost', () => {
  const mattermostHookDefault = process.env.MATTERMOST_HOOK
  const mattermostHook = 'some-value'

  beforeEach(() => {
    process.env.MATTERMOST_HOOK = mattermostHook
  })

  afterEach(() => {
    process.env.MATTERMOST_HOOK = mattermostHookDefault
  })

  describe('sendAllMessages', () => {
    it('should generate a beautiful payload', async () => {
      // Given
      const mattermostReporter = new MattermostReporter({ channel: '~front' })
      messages.map(message => mattermostReporter.write(message))

      // When
      await mattermostReporter.sendAllMessages()

      // Then
      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(mattermostHook, {
        body: '{"channel":"~front","text":"\\n## Repository: cozy/cozy-drive\\n\\n Rule | Symbol | State of the rule\\n ---|:----:| -----\\ndep-up-to-date | ℹ️ | cozy-ui: 62.1.2, last is 62.1.4\\ndep-up-to-date | ⚠️ | cozy-client: ^27.19.4, last is 27.22.0\\ndep-up-to-date | 🚩 | cozy-realtime: 3.13.0, last is 4.0.5\\n\\n## Repository: cozy/cozy-banks\\n\\n Rule | Symbol | State of the rule\\n ---|:----:| -----\\ndep-up-to-date | ✅ | cozy-ui: ^62.1.4, last is 62.1.4\\ndep-up-to-date | ⚠️ | cozy-client: ^27.17.0, last is 27.22.0\\ndep-up-to-date | 🚩 | cozy-realtime: 3.11.0, last is 4.0.5"}',
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
    })
  })
})
