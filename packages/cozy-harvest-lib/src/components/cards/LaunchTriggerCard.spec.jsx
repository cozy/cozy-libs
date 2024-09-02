import LaunchTriggerCard from 'components/cards/LaunchTriggerCard'
import { mount } from 'enzyme'
import React from 'react'

import CozyClient, { CozyProvider } from 'cozy-client'
import I18n from 'cozy-ui/transpiled/react/providers/I18n'

import enLocale from '../../locales/en.json'
import ConnectionFlow from '../../models/ConnectionFlow'

jest.mock('../../models/ConnectionFlow', () => {
  // Require the original module to not be mocked...
  const { default: mockConnectionFlow } = jest.requireActual(
    '../../models/ConnectionFlow'
  )

  mockConnectionFlow.prototype.watchJob = jest.fn()

  return mockConnectionFlow
})

const triggerFixture = {
  _id: 'd861818b62204988bf0bb78c182a9149',
  arguments: '0 0 0 * * 0'
}
const konnectorFixture = {
  slug: 'boursorama83',
  parameters: {
    bankId: '100000'
  },
  partnership: {
    domain: 'https://budget-insight.com'
  }
}

describe('LaunchTriggerCard', () => {
  const client = new CozyClient({})
  client.plugins = {
    realtime: {
      sendNotification: jest.fn(),
      subscribe: jest.fn()
    }
  }

  const setup = ({ props }) => {
    const root = mount(
      <CozyProvider client={client}>
        <I18n dictRequire={() => enLocale} lang="en">
          <LaunchTriggerCard {...props} />
        </I18n>
      </CozyProvider>
    )
    return { root }
  }

  it('should render impossible to run message when konnector is clientSide without an accessible launcher', () => {
    const { root } = setup({
      props: {
        flow: new ConnectionFlow(
          client,
          triggerFixture,
          {
            slug: 'test',
            name: 'testname',
            clientSide: true
          },
          konnectorFixture
        )
      }
    })
    expect(root.html()).toMatchSnapshot()
  })
})
