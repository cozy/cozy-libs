import React from 'react'
import { mount } from 'enzyme'
import { ShareByEmail } from './ShareByEmail'

describe('ShareByEmailComponent', () => {
  it('shoud call share if submited', async () => {
    const onShare = jest.fn()
    const props = {
      contacts: {
        data: []
      },
      t: x => x,
      groups: { data: [] },
      documentType: 'Files',
      onShare: onShare,
      document: {
        id: 'doc_id'
      },
      sharingDesc: 'test',
      createContact: jest.fn()
    }
    const comp = mount(<ShareByEmail {...props} />)
    comp.instance().onRecipientPick({ id: 1, email: 'quentin@cozycloud.cc' })
    await comp.instance().share()
    expect(onShare).toHaveBeenCalledWith(
      {
        id: 'doc_id'
      },
      [{ email: 'quentin@cozycloud.cc', id: 1 }],
      'two-way',
      'test'
    )
  })
})
