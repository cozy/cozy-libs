import CozyRealtime from 'cozy-realtime'

const JOBS_DOCTYPE = 'io.cozy.jobs'

export const waitForRealtimeResult = (client, job) =>
  new Promise((resolve, reject) => {
    const rt = new CozyRealtime({ client })

    const handleUpdate = jobAttributes => {
      if (jobAttributes.state == 'errored') {
        reject(`Job finished with error : ${jobAttributes.error}`)
      }
    }
    const id = job._id
    const handleNotification = event => {
      rt.unsubscribe('notified', JOBS_DOCTYPE, id, handleNotification)
      resolve(event)
    }

    rt.subscribe('updated', JOBS_DOCTYPE, id, handleUpdate)
    rt.subscribe('notified', JOBS_DOCTYPE, id, handleNotification)
    setTimeout(() => {
      reject(new Error('Timeout for waitForRealtimeResult'))
    }, 15 * 1000)
  })
