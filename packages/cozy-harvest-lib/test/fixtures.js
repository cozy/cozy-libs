const fixtures = {
  credentials: {
    username: 'foo',
    passphrase: 'bar'
  },
  konnector: {
    slug: 'konnectest',
    vendor_link: 'https://cozy.io',
    fields: {
      username: {
        type: 'text'
      },
      passphrase: {
        type: 'password'
      }
    }
  },
  clientKonnector: {
    slug: 'konnectest',
    clientSide: true,
    fields: {}
  },
  konnectorWithFolder: {
    _type: 'io.cozy.konnectors',
    name: 'myBills',
    slug: 'mybills',
    vendor_link: 'https://cozy.io',
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
      account: 'created-account-id',
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
    _id: 'created-account-id',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  updatedAccount: {
    _id: 'updated-account-id',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'fuz'
    }
  },
  existingAccount: {
    _id: 'existing-account-id',
    account_type: 'konnectest',
    auth: {
      username: 'foo',
      passphrase: 'bar'
    },
    identifier: 'username'
  },
  existingTrigger: {
    id: 'existing-trigger-id',
    _type: 'io.cozy.triggers',
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'existing-account-id',
        konnector: 'konnectest'
      }
    },
    current_state: {
      last_executed_job_id: 'testjobid'
    }
  },
  bankingKonnectorAccountAttributes: {
    auth: {
      identifier: '80564789',
      secret: '13337'
    },
    identifier: '80564789'
  },
  createdTrigger: {
    id: 'created-trigger-id',
    _id: 'created-trigger-id',
    _type: 'io.cozy.triggers',
    current_state: {
      status: 'done',
      last_executed_job_id: 'old-job-id'
    },
    message: {
      account: 'updated-account-id',
      konnector: 'konnectest'
    },
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'updated-account-id',
        konnector: 'konnectest'
      }
    }
  },
  erroredTrigger: {
    id: 'errored-trigger-id',
    _type: 'io.cozy.triggers',
    current_state: {
      status: 'errored',
      last_error: 'last error message'
    },
    message: {
      account: 'updated-account-id',
      konnector: 'konnectest'
    },
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'updated-account-id',
        konnector: 'konnectest'
      }
    }
  },
  runningTrigger: {
    id: 'running-trigger-id',
    _id: 'running-trigger-id',
    _type: 'io.cozy.triggers',
    current_state: {
      status: 'running',
      last_executed_job_id: 'running-job-id'
    },
    message: {
      account: 'updated-account-id',
      konnector: 'konnectest'
    },
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'updated-account-id',
        konnector: 'konnectest'
      }
    }
  },
  createdTriggerWithFolder: {
    id: 'created-trigger-id',
    _type: 'io.cozy.triggers',
    message: {
      account: 'updated-account-id',
      konnector: 'konnectest',
      folder_to_save: 'folder-id'
    },
    attributes: {
      arguments: '0 0 0 * * 0',
      type: '@cron',
      worker: 'konnector',
      message: {
        account: 'updated-account-id',
        konnector: 'konnectest',
        folder_to_save: 'folder-id'
      }
    }
  },
  clientTrigger: {
    id: 'client-trigger-id',
    _type: 'io.cozy.triggers',
    message: {
      account: 'updated-account-id',
      konnector: 'clientkonnector',
      folder_to_save: 'folder-id'
    },
    attributes: {
      type: '@client',
      worker: 'client',
      message: {
        account: 'updated-account-id',
        konnector: 'clientkonnector',
        folder_to_save: 'folder-id'
      }
    }
  },
  launchedJob: {
    type: 'io.cozy.jobs',
    _id: 'lauched-job-id',
    id: 'lauched-job-id',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/lauched-job-id'
    }
  },
  runningJob: {
    type: 'io.cozy.jobs',
    id: 'running-job-id',
    _id: 'running-job-id',
    trigger_id: 'running-trigger-id',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'running',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/running-job-id'
    }
  },
  doneJob: {
    type: 'io.cozy.jobs',
    id: 'done-job-id',
    domain: 'cozy.tools:8080',
    worker: 'konnector',
    state: 'done',
    queued_at: '2016-09-19T12:35:08Z',
    started_at: '2016-09-19T12:35:08Z',
    error: '',
    links: {
      self: '/jobs/done-job-id'
    }
  },
  triggers: [
    {
      message: {
        account: 'otherslug-account',
        konnector: 'otherslug'
      }
    },
    {
      message: {
        account: 'otherslug-account2',
        konnector: 'otherslug'
      }
    }
  ],
  accounts: [
    {
      _id: 'otherslug-account',
      account_type: 'otherslug',
      auth: { login: 'badlogin', password: 'toto' }
    },
    {
      _id: 'otherslug-account2',
      account_type: 'otherslug',
      auth: { login: 'goodlogin', password: 'badpassword' }
    },
    {
      account_type: 'konnectest',
      auth: { login: 'goodlogin', password: 'secretpassword' }
    }
  ]
}

export default fixtures
