/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import MicroEE from 'microee'

import { TriggerManager } from 'components/TriggerManager'

import { SUCCESS_EVENT, LOGIN_SUCCESS_EVENT } from 'models/KonnectorJob'

const fixtures = {
  data: {
    username: 'foo',
    passphrase: 'bar'
  },
  konnector: {
    slug: 'konnectest',
    fields: {
      username: {
        type: 'text'
      },
      passphrase: {
        type: 'password'
      }
    }
  },
  konnectorWithFolder: {
    name: 'myBills',
    slug: 'mybills',
    fields: {
      advancedFields: {
        folderPath: {
          advanced: true
        }
      }
    }
  },
  folder: {
    _id: '3f5b288af36041f189ec22063adab706'
  },
  folderPath: '/Administrative/myBills/foo',
  folderPermission: {
    saveFolder: {
      type: 'io.cozy.files',
      values: ['3f5b288af36041f189ec22063adab706'],
      verbs: ['GET', 'PATCH', 'POST']
    }
  },
  triggerAttributes: {
    arguments: '0 0 0 * * 0',
    type: '@cron',
    worker: 'konnector',
    message: {
      account: 'a87f9a8bd3884479a48811e7b7deec75',
      konnector: 'konnectest'
    }
  },
  account: {
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  createdAccount: {
    _id: 'a87f9a8bd3884479a48811e7b7deec75',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  updatedAccount: {
    _id: 'a87f9a8bd3884479a48811e7b7deec75',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'fuz'
    }
  },
  existingAccount: {
    _id: '61c683295560485db0f34b859197c581',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  existingTrigger: {
    id: '4b67e0bedd464704a6a995f5c2070ccf',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: '61c683295560485db0f34b859197c581',
        konnector: 'konnectest'
      }
    }
  },
  createdTrigger: {
    id: '669e9a7cc3064a97bc0aa20feef71cb2',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'a87f9a8bd3884479a48811e7b7deec75',
        konnector: 'konnectest'
      }
    }
  },
  launchedJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  },
  runningJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  },
  doneJob: {
    type: 'io.cozy.jobs',
    id: 'ac09e6f4473f4b6fbb83c9d2f532504e',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'done',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/ac09e6f4473f4b6fbb83c9d2f532504e'
    }
  }
}

const tMock = x => x

class KonnectorJobMock {
  constructor(account, trigger) {
    this.account = account
    this.trigger = trigger
  }
  getAccount = () => this.account
  getTrigger = () => this.trigger
  getTriggerError = jest.fn()
  launch = jest.fn()
  prepareConnection = jest.fn(() => Promise.resolve())
  unwatch = jest.fn()
}
MicroEE.mixin(KonnectorJobMock)

const props = {
  konnector: fixtures.konnector,
  t: tMock,
  konnectorJob: new KonnectorJobMock()
}

const propsWithAccount = {
  ...props,
  konnectorJob: new KonnectorJobMock(
    fixtures.existingAccount,
    fixtures.existingTrigger
  )
}

const shallowWithoutAccount = konnector =>
  shallow(
    <TriggerManager {...props} konnector={konnector || fixtures.konnector} />
  )

const shallowWithAccount = (customProps = {}) =>
  shallow(<TriggerManager {...propsWithAccount} {...customProps} />)

describe('TriggerManager', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render without account', () => {
    const component = shallowWithoutAccount().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should render with account', () => {
    const component = shallowWithAccount().getElement()
    expect(component).toMatchSnapshot()
  })

  it('should unwatch on unmount', () => {
    const wrapper = shallowWithAccount()
    wrapper.unmount()
    expect(propsWithAccount.konnectorJob.unwatch).toHaveBeenCalled()
  })

  describe('handleSubmit', () => {
    beforeEach(() => {
      jest.resetAllMocks()
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('should call konnectorJob.prepareConnection without account', async () => {
      const wrapper = shallowWithoutAccount()
      await wrapper.instance().handleSubmit(fixtures.data)
      expect(props.konnectorJob.prepareConnection).toHaveBeenCalledWith(
        fixtures.konnector,
        fixtures.data,
        expect.any(String)
      )
    })

    it('should call konnectorJob.prepareConnection with account', async () => {
      const wrapper = shallowWithAccount()
      await wrapper.instance().handleSubmit(fixtures.data)
      expect(
        propsWithAccount.konnectorJob.prepareConnection
      ).toHaveBeenCalledWith(
        fixtures.konnector,
        fixtures.data,
        expect.any(String)
      )
    })

    it('should set onLoginSuccess if provided', async () => {
      const onLoginSuccessMock = jest.fn()
      const onSpy = jest.spyOn(propsWithAccount.konnectorJob, 'on')
      const wrapper = shallowWithAccount({
        onLoginSuccess: onLoginSuccessMock
      })
      jest.resetAllMocks()

      await wrapper.instance().handleSubmit(fixtures.data)
      expect(onSpy).toHaveBeenCalledWith(
        LOGIN_SUCCESS_EVENT,
        expect.any(Function)
      )

      // test callback
      onSpy.mock.calls[0][1]()
      expect(onLoginSuccessMock).toHaveBeenCalledWith(fixtures.existingTrigger)
      expect(propsWithAccount.konnectorJob.launch).toHaveBeenCalled()
    })

    it('should set onSuccess if provided', async () => {
      const onSuccessMock = jest.fn()
      const onSpy = jest.spyOn(propsWithAccount.konnectorJob, 'on')
      const wrapper = shallowWithAccount({
        onSuccess: onSuccessMock
      })
      jest.resetAllMocks()

      await wrapper.instance().handleSubmit(fixtures.data)
      expect(onSpy).toHaveBeenCalledWith(SUCCESS_EVENT, expect.any(Function))

      // test callback
      onSpy.mock.calls[0][1]()
      expect(onSuccessMock).toHaveBeenCalledWith(fixtures.existingTrigger)
      expect(propsWithAccount.konnectorJob.launch).toHaveBeenCalled()
    })
  })
})
