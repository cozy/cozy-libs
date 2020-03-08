import { mount } from 'enzyme'
import React from 'react'
import { act } from 'react-dom/test-utils'
import ConnectionFlow from './ConnectionFlow'
import CozyClient from 'cozy-client'
import withConnectionFlow from './withConnectionFlow'

const DumbTriggerStatus = ({ flowState }) => {
  return <div>{flowState.status.toString()}</div>
}

const TriggerStatus = withConnectionFlow()(DumbTriggerStatus)

describe('with connection flow', () => {
  it('should update correctly', () => {
    const client = new CozyClient({})
    const flow = new ConnectionFlow(client)
    const root = mount(<TriggerStatus flow={flow} />)
    expect(root.find('div').text()).toBe('IDLE')
    act(() => {
      flow.setState({ status: 'SUCCESS' })
    })
    expect(root.find('div').text()).toBe('SUCCESS')
  })
})
