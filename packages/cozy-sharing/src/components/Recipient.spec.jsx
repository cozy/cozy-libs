import React from 'react'
import { mount } from 'enzyme'
import { Status } from './Recipient'
import AppLike from '../../test/AppLike'
describe('Recipient component', () => {
  //const props = isOwner, status, instance, type, documentType, name, client, t

  const client = {
    options: {
      uri: 'foo.mycozy.cloud'
    }
  }

  it('should render if isMe ', () => {
    const component = mount(
      <AppLike>
        <Status
          instance="foo.mycozy.cloud"
          client={client}
          t={x => x}
          status="ready"
        />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot if isOwner', () => {
    const component = mount(
      <AppLike>
        <Status
          instance="foo.mycozy.cloud"
          client={client}
          t={x => x}
          status="ready"
          isOwner="true"
        />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot if isMe and type folder', () => {
    const component = mount(
      <AppLike>
        <Status
          instance="foo.mycozy.cloud"
          client={client}
          t={x => x}
          status="ready"
          type="folder"
        />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })

  it('should match snapshot if isMe and type file', () => {
    const component = mount(
      <AppLike>
        <Status
          instance="foo.mycozy.cloud"
          client={client}
          t={x => x}
          status="ready"
          type="file"
        />
      </AppLike>
    )
    expect(component).toMatchSnapshot()
  })

  it('should call revokeSelf is i m not the owner but try to revoke myselk', async () => {
    const onRevoke = jest.fn()
    const onRevokeSelf = jest.fn()
    const component = mount(
      <AppLike>
        <Status
          instance="foo.mycozy.cloud"
          client={client}
          t={x => x}
          status="ready"
          type="file"
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          isOwner={false}
        />
      </AppLike>
    )

    const instance = component.find(Status).instance()

    await instance.onRevoke()
    expect(onRevokeSelf).toBeCalled()
  })

  it('should call revoke if I m the owner of the sharing', async () => {
    const onRevoke = jest.fn()
    const onRevokeSelf = jest.fn()
    const component = mount(
      <AppLike>
        <Status
          instance="foo.mycozy.cloud"
          client={client}
          t={x => x}
          status="ready"
          type="file"
          onRevoke={onRevoke}
          onRevokeSelf={onRevokeSelf}
          isOwner={true}
        />
      </AppLike>
    )

    const instance = component.find(Status).instance()

    await instance.onRevoke()
    expect(onRevoke).toBeCalled()
  })
})
