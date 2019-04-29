import Authentication from './Authentication'
import React from 'react'
import { shallow } from 'enzyme'

describe('Authentication', () => {
  let root, client, instance, onComplete, onException

  const setup = () => {
    client = {
      register: jest.fn(() => {
        return { token: 'registrationToken' }
      }),
      login: jest.fn(),
      getStackClient: () => client.stackClient
    }
    onComplete = jest.fn()
    onException = jest.fn()
    const options = {
      context: { client }
    }
    root = shallow(
      <Authentication
        appIcon="icon.png"
        onComplete={onComplete}
        onException={onException}
      />,
      options
    )
    instance = root.dive().instance()
  }

  it('should connect to server with cozy-client', async () => {
    setup(client)
    await instance.connectToServer('pbrowne.mycozy.cloud')
    expect(client.register).toHaveBeenCalledWith('pbrowne.mycozy.cloud')
    expect(onException).not.toHaveBeenCalled()
    expect(onComplete).toHaveBeenCalled()
  })

  it('should call on exception if there is a problem', async () => {
    setup(client)
    client.register.mockImplementation(() => {
      throw new Error('No internet...')
    })
    await instance.connectToServer('pbrowne.mycozy.cloud')
    expect(onException).toHaveBeenCalled()
  })
})
