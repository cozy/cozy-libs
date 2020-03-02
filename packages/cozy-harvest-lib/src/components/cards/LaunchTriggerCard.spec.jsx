import React from 'react'
import { mount } from 'enzyme'

import I18n from 'cozy-ui/transpiled/react/I18n'
import LaunchTriggerCard, {
  DumbLaunchTriggerCard
} from 'components/cards/LaunchTriggerCard'
import CozyClient, { CozyProvider } from 'cozy-client'
import ConnectionFlow from '../../models/ConnectionFlow'
import enLocale from '../../locales/en'

const triggerFixture = {
  _id: 'd861818b62204988bf0bb78c182a9149',
  arguments: '0 0 0 * * 0'
}

describe('LaunchTriggerCard', () => {
  const client = new CozyClient({})

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

  it('should create a flow automatically if props.flow is not passed from above', () => {
    const { root } = setup({
      props: {
        flowProps: {
          initialTrigger: triggerFixture
        }
      }
    })
    expect(root.find(DumbLaunchTriggerCard).props().flow).toBeDefined()
    expect(root.find(DumbLaunchTriggerCard).props().flow.trigger).toEqual(
      triggerFixture
    )
  })

  it('should pass props.flow downstream is passed from above', () => {
    const { root } = setup({
      props: {
        flow: new ConnectionFlow(client, triggerFixture)
      }
    })
    expect(root.find(DumbLaunchTriggerCard).props().flow).toBeDefined()
    expect(root.find(DumbLaunchTriggerCard).props().flow.trigger).toEqual(
      triggerFixture
    )
  })
})
