import React from 'react'
import { mount } from 'enzyme'

import I18n from 'cozy-ui/transpiled/react/I18n'
import LaunchTriggerCard, {
  DumbLaunchTriggerCard
} from 'components/cards/LaunchTriggerCard'
import CozyClient, { CozyProvider } from 'cozy-client'
import ConnectionFlow from '../../models/ConnectionFlow'
import enLocale from '../../locales/en.json'

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
          initialTrigger: triggerFixture,
          konnector: konnectorFixture
        }
      }
    })
    expect(root.find(DumbLaunchTriggerCard).props().flow).toBeDefined()
    expect(root.find(DumbLaunchTriggerCard).props().flow.trigger).toEqual(
      triggerFixture
    )
  })

  it('should pass props.flow downstream if passed from above', () => {
    const { root } = setup({
      props: {
        flow: new ConnectionFlow(client, triggerFixture, konnectorFixture)
      }
    })
    expect(root.find(DumbLaunchTriggerCard).props().flow).toBeDefined()
    expect(root.find(DumbLaunchTriggerCard).props().flow.trigger).toEqual(
      triggerFixture
    )
  })

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

  it('should render normally when konnector is not clientSide', () => {
    const { root } = setup({
      props: {
        flow: new ConnectionFlow(client, triggerFixture, {
          slug: 'test',
          name: 'testname'
        })
      }
    })
    expect(root.html()).toMatchSnapshot()
  })
})
