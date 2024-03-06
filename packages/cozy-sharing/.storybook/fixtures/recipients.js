const recipients = [
  {
    status: 'owner',
    public_name: 'Alice',
    email: 'alice@cozy.localhost',
    instance: 'http://alice.cozy.localhost:8080',
    type: 'two-way',
    index: 0
  },
  {
    status: 'pending',
    email: 'bob@cozy.localhost',
    type: 'two-way',
    index: 1
  },
  {
    name: 'Paul',
    status: 'mail-not-sent',
    email: 'paul@cozy.localhost',
    index: 2
  },
  {
    name: 'Eve',
    status: 'ready',
    email: 'eve@cozy.localhost',
    index: 2
  }
]

export { recipients }
