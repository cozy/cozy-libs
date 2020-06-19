export const SHARING1_FROM_REALTIME = {
  _id: 'cbf42d6dd76e9cfdf074449ac1007c7b',
  _rev: '1-027ffe900fe3da2e27eb32952cf4aa4f',
  triggers: {},
  active: true,
  owner: true,
  open_sharing: true,
  description: 'Administrative',
  app_slug: 'drive',
  preview_path: '/preview',
  created_at: '2020-06-19T11:54:33.133772+02:00',
  updated_at: '2020-06-19T11:54:33.133772+02:00',
  rules: [
    {
      title: 'Administrative',
      doctype: 'io.cozy.files',
      values: ['6045d30ce474b9a8e7603e8e613b297c'],
      add: 'sync',
      update: 'sync',
      remove: 'sync'
    }
  ],
  members: [
    {
      status: 'owner',
      public_name: 'q',
      email: 'bob@cozy.tools',
      instance: 'http://q.cozy.tools:8080'
    },
    {
      status: 'mail-not-sent',
      name: 'quentin.valmori@xyz.com',
      email: 'quentin.valmori@xyz.com'
    }
  ]
}

export const SHARINGS_DOCTYPE = 'io.cozy.sharings'

export const SHARING1_FROM_INTERNAL_STORE = {
  attributes: {
    active: true,
    owner: true,
    open_sharing: true,
    description: 'Administrative',
    app_slug: 'drive',
    preview_path: '/preview',
    created_at: '2020-06-19T11:54:33.133772+02:00',
    updated_at: '2020-06-19T11:54:33.133772+02:00',
    rules: [
      {
        title: 'Administrative',
        doctype: 'io.cozy.files',
        values: ['6045d30ce474b9a8e7603e8e613b297c'],
        add: 'sync',
        update: 'sync',
        remove: 'sync'
      }
    ],
    members: [
      {
        status: 'owner',
        public_name: 'q',
        email: 'bob@cozy.tools',
        instance: 'http://q.cozy.tools:8080'
      },
      {
        status: 'mail-not-sent',
        name: 'quentin.valmori@xyz.com',
        email: 'quentin.valmori@xyz.com'
      }
    ]
  },
  id: 'cbf42d6dd76e9cfdf074449ac100e9a9',
  links: { self: '/sharings/cbf42d6dd76e9cfdf074449ac100e9a9' },
  meta: { rev: '2-504e1b1b44e85b99a6acadfb2e2aa4e5' },
  relationships: { shared_docs: { data: null } },
  type: 'io.cozy.sharings',
  _id: 'cbf42d6dd76e9cfdf074449ac100e9a9',
  _type: 'io.cozy.sharings'
}

export const SHARING2_FROM_REALTIME = {
  _id: 'cbf42d6dd76e9cfdf074449ac1007c7b',
  _rev: '5-f75c44d57617fd5d27888d56fe3f5026',
  triggers: {},
  owner: true,
  open_sharing: true,
  description: 'Administrative',
  app_slug: 'drive',
  preview_path: '/preview',
  created_at: '2020-06-19T11:54:33.133772+02:00',
  updated_at: '2020-06-19T11:54:33.133772+02:00',
  rules: [
    {
      title: 'Administrative',
      doctype: 'io.cozy.files',
      values: ['6045d30ce474b9a8e7603e8e613b297c'],
      add: 'sync',
      update: 'sync',
      remove: 'sync'
    }
  ],
  members: [
    {
      status: 'owner',
      public_name: 'q',
      email: 'bob@cozy.tools',
      instance: 'http://q.cozy.tools:8080'
    },
    {
      status: 'pending',
      name: 'quentin.valmori@gmail.com',
      email: 'quentin.valmori@gmail.com'
    },
    {
      email: 'bob@cozy.io',
      name: 'bob@cozy.io',
      status: 'pending'
    }
  ],
  credentials: [{}]
}
