jest.mock('cozy-device-helper', () => ({
  getPlatform: () => 'testing-platform',
  nativeLinkOpen: jest.fn(),
  isAndroidApp: () => false
}))

import { mount } from 'enzyme'
import React from 'react'

import CozyClient from 'cozy-client'
import { nativeLinkOpen } from 'cozy-device-helper'

import { ButtonLinkRegistration } from './ButtonLinkRegistration'

describe('ButtonLinkRegistration', () => {
  let uut, instance

  const setup = () => {
    const client = new CozyClient({
      oauth: {
        clientName: 'clientName',
        redirectURI: 'redirectURI',
        softwareID: 'softwareID',
        softwareVersion: 'softwareVersion',
        clientURI: 'clientURI',
        logoURI: 'logoURI',
        policyURI: 'policyURI',
        scope: 'scope'
      }
    })
    uut = mount(
      <ButtonLinkRegistration label="Testing Button" client={client} />
    )
    instance = uut.instance()
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should handle click', () => {
    jest
      .spyOn(ButtonLinkRegistration.prototype, 'handleClick')
      .mockImplementation(() => {})
    setup()
    uut.find('button').simulate('click')
    expect(ButtonLinkRegistration.prototype.handleClick).toHaveBeenCalled()
  })

  it('should use nativeLinkOpen with the correct URL', async () => {
    setup()
    await instance.handleClick()
    expect(nativeLinkOpen).toHaveBeenCalledWith({
      url: expect.any(String)
    })
  })
})
