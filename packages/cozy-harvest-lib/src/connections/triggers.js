import KonnectorJobWatcher from '../models/konnector/KonnectorJobWatcher'

const TRIGGERS_DOCTYPE = 'io.cozy.triggers'

/**
 * Creates a trigger with given attributes
 * @param  {Object} client CozyClient
 * @param  {Object}   attributes
 * @return {Object}   Created trigger
 */
const createTrigger = async (client, attributes) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).create(attributes)
  return data
}

const fetchTrigger = async (client, id) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).get(id)
  return data
}

/**
 * Triggers job associated to given trigger
 * @param  {Object} client CozyClient
 * @param  {Object}  Trigger to launch
 * @return {Object}  Job document
 */
const launchTrigger = async (client, trigger) => {
  const { data } = await client.collection(TRIGGERS_DOCTYPE).launch(trigger)
  return data
}

/**
 * This method is here to listen the jobs.
 *
 * expectedSuccessDelay: Is the time (in ms) before dispatching
 * a `LOGIN_SUCESS` event if nothing was received before this delay
 * (error, success or login success)
 *
 * It means that if the login process takes more than this time, we
 * will have a `LOGIN_SUCESS` even if it's not the case.
 *
 * @param {Object} client CozyClient
 * @param {Object} job
 *
 */
const watchKonnectorJob = (client, job) => {
  const jobWatcher = new KonnectorJobWatcher(client, job, {
    expectedSuccessDelay: 8000
  })
  // no need to await realtime initializing here
  jobWatcher.watch()
  return jobWatcher
}

/**
 * Return triggers mutations
 * @param  {Object} client CozyClient
 * @return {Object}        Object containing mutations
 */
export const triggersMutations = client => {
  return {
    createTrigger: createTrigger.bind(null, client),
    fetchTrigger: fetchTrigger.bind(null, client),
    launchTrigger: launchTrigger.bind(null, client),
    watchKonnectorJob: watchKonnectorJob.bind(null, client)
  }
}

export default triggersMutations
