import { DumbAuthentication } from './Authentication'
import React from 'react'
import { shallow } from 'enzyme'
import CozyClient from 'cozy-client'

describe('Authentication', () => {
  let root, client, instance, onComplete, onException

  const setup = () => {
    client = new CozyClient({ oauth: {} })
    jest
      .spyOn(client, 'register')
      .mockImplementation(() => Promise.resolve({ token: '{}' }))
    jest.spyOn(client.stackClient, 'unregister').mockImplementation(() => {})
    onComplete = jest.fn()
    onException = jest.fn()
    root = shallow(
      <DumbAuthentication
        client={client}
        appIcon="icon.png"
        onComplete={onComplete}
        onException={onException}
      />
    )
    instance = root.instance()
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

  it('should unregister the client in case of a problem', async () => {
    setup()
    client.register.mockImplementation(() => {
      throw new Error('No internet...')
    })
    await instance.connectToServer('pbrowne.mycozy.cloud')
    expect(client.stackClient.unregister).toHaveBeenCalled()
  })
})
