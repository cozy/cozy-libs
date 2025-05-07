export const SHARING_1 = {
  type: 'io.cozy.sharings',
  id: 'sharing_1',
  attributes: {
    active: true,
    owner: true,
    description: 'Holidays',
    app_slug: 'drive',
    created_at: '2018-05-21T11:52:19.732097476+02:00',
    updated_at: '2018-05-21T11:52:19.732097476+02:00',
    rules: [
      {
        title: 'Holidays',
        doctype: 'io.cozy.files',
        values: ['folder_1'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: 'ready',
        name: 'John Doe',
        email: 'john@doe.com',
        instance: 'http://cozy.local:8080'
      },
      {
        status: 'ready',
        name: 'John Doe 2',
        email: 'john2@doe.com',
        instance: 'http://cozy.local:8080'
      }
    ]
  },
  relationships: {
    shared_docs: {
      data: [
        { id: 'folder_1_1', type: 'io.cozy.files' },
        { id: 'folder_1_2', type: 'io.cozy.files' }
      ]
    }
  }
}

export const SHARING_2 = {
  type: 'io.cozy.sharings',
  id: 'sharing_2',
  attributes: {
    active: true,
    owner: true,
    description: 'Administrative',
    app_slug: 'drive',
    created_at: '2018-05-21T11:52:19.732097476+02:00',
    updated_at: '2018-05-21T11:52:19.732097476+02:00',
    rules: [
      {
        title: 'Administrative',
        doctype: 'io.cozy.files',
        values: ['folder_2'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: 'ready',
        name: 'John Doe',
        email: 'john@doe.com',
        instance: 'http://cozy.local:8080'
      }
    ]
  },
  relationships: {
    shared_docs: {
      data: [
        { id: 'folder_2_1', type: 'io.cozy.files' },
        { id: 'folder_2_2', type: 'io.cozy.files' }
      ]
    }
  }
}

export const SHARING_3 = {
  type: 'io.cozy.sharings',
  id: 'sharing_3',
  attributes: {
    active: true,
    owner: true,
    description: 'Holidays',
    app_slug: 'drive',
    created_at: '2018-05-21T11:52:19.732097476+02:00',
    updated_at: '2018-05-21T11:52:19.732097476+02:00',
    rules: [
      {
        title: 'Holidays',
        doctype: 'io.cozy.files',
        values: ['folder_1'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: 'pending',
        name: 'Johnny Doe',
        email: 'johnny@doe.com',
        instance: 'http://cozy.foo:8080'
      }
    ]
  },
  relationships: {
    shared_docs: {
      data: [
        { id: 'folder_1_1', type: 'io.cozy.files' },
        { id: 'folder_1_2', type: 'io.cozy.files' }
      ]
    }
  }
}

export const SHARING_NO_ACTIVE = {
  type: 'io.cozy.sharings',
  id: 'sharing_4',
  attributes: {
    active: false,
    owner: true,
    description: 'Holidays',
    app_slug: 'drive',
    created_at: '2018-05-21T11:52:19.732097476+02:00',
    updated_at: '2018-05-21T11:52:19.732097476+02:00',
    rules: [
      {
        title: 'Holidays',
        doctype: 'io.cozy.files',
        values: ['folder_1'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: 'pending',
        name: 'Johnny Doe',
        email: 'johnny@doe.com',
        instance: 'http://cozy.foo:8080'
      }
    ]
  },
  relationships: {
    shared_docs: {
      data: [
        { id: 'folder_1_1', type: 'io.cozy.files' },
        { id: 'folder_1_2', type: 'io.cozy.files' }
      ]
    }
  }
}

export const SHARING_READ_ONLY = {
  type: 'io.cozy.sharings',
  id: 'sharing_read_only',
  attributes: {
    active: true,
    owner: true,
    description: 'Holidays',
    app_slug: 'drive',
    created_at: '2018-05-21T11:52:19.732097476+02:00',
    updated_at: '2018-05-21T11:52:19.732097476+02:00',
    rules: [
      {
        title: 'Holidays',
        doctype: 'io.cozy.files',
        values: ['folder_1'],
        add: 'push',
        update: 'push',
        remove: 'push'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: 'pending',
        name: 'Johnny Doe',
        email: 'johnny@doe.com',
        instance: 'http://cozy.foo:8080'
      }
    ]
  },
  relationships: {
    shared_docs: {
      data: [
        { id: 'folder_1_1', type: 'io.cozy.files' },
        { id: 'folder_1_2', type: 'io.cozy.files' }
      ]
    }
  }
}

export const SHARING_WITH_SHORTCUT = {
  type: 'io.cozy.sharings',
  id: 'sharing_5',
  attributes: {
    active: true,
    owner: true,
    description: 'Holidays',
    app_slug: 'drive',
    created_at: '2018-05-21T11:52:19.732097476+02:00',
    updated_at: '2018-05-21T11:52:19.732097476+02:00',
    shortcut_id: 'shortcut_id',
    rules: [
      {
        title: 'Holidays',
        doctype: 'io.cozy.files',
        values: ['previewed_folder_id'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        name: 'Jane Doe',
        email: 'jane@doe.com',
        instance: 'http://cozy.tools:8080'
      },
      {
        status: 'pending',
        name: 'Johnny Doe',
        email: 'johnny@doe.com',
        instance: 'http://cozy.foo:8080'
      }
    ]
  },
  relationships: {
    shared_docs: {
      data: [
        { id: 'folder_1_1', type: 'io.cozy.files' },
        { id: 'folder_1_2', type: 'io.cozy.files' }
      ]
    }
  }
}

export const PERM_1 = {
  type: 'io.cozy.permissions',
  id: 'perm_1',
  attributes: {
    type: 'share',
    permissions: {
      rule0: {
        type: 'io.cozy.files',
        verbs: ['GET'],
        values: ['folder_1']
      }
    },
    codes: { email: 'longcode' }
  }
}

export const PERM_2 = {
  type: 'io.cozy.permissions',
  id: 'perm_2',
  attributes: {
    type: 'share',
    permissions: {
      rule0: {
        type: 'io.cozy.files',
        verbs: ['GET'],
        values: ['folder_2']
      }
    },
    codes: { email: 'longcode' },
    shortcodes: { email: 'shortcode' }
  }
}

export const PERM_WITHOUT_DOC = {
  type: 'io.cozy.permissions',
  id: 'PERM_WITHOUT_DOC',
  attributes: {
    type: 'share',
    permissions: {
      rule0: {
        type: 'io.cozy.files',
        verbs: ['GET']
      }
    },
    codes: { email: 'longcode' },
    shortcodes: { email: 'shortcode' }
  }
}

export const APPS = [
  {
    _type: 'io.cozy.apps',
    id: 'io.cozy.apps/drive',
    _id: 'io.cozy.apps/drive',
    name: 'Drive',
    name_prefix: 'Cozy',
    editor: 'Cozy',
    type: 'webapp',
    slug: 'drive',
    state: 'ready',
    attributes: {
      name: 'Drive',
      name_prefix: 'Cozy',
      editor: 'Cozy',
      type: 'webapp',
      slug: 'drive',
      state: 'ready'
    },
    links: {
      self: '/apps/drive',
      related: 'https://drive.cozy.tools/',
      icon: '/apps/drive/icon'
    }
  },
  {
    _type: 'io.cozy.apps',
    id: 'io.cozy.apps/photos',
    _id: 'io.cozy.apps/photos',
    name: 'Photos',
    name_prefix: 'Cozy',
    editor: 'Cozy',
    type: 'webapp',
    slug: 'photos',
    state: 'ready',
    attributes: {
      name: 'Photos',
      name_prefix: 'Cozy',
      editor: 'Cozy',
      type: 'webapp',
      slug: 'photos',
      state: 'ready'
    },
    links: {
      self: '/apps/photos',
      related: 'https://photos.cozy.tools/',
      icon: '/apps/photos/icon'
    }
  }
]
