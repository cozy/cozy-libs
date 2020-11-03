import { Q } from 'cozy-client'
Q('io.cozy.todos').where({
  done: true
})
