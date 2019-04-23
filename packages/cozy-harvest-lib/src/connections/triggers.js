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

const watchKonnectorJob = (
  client,
  job,
  { onError, onLoginSuccess, onSuccess }
) => {
  new KonnectorJobWatcher(client, job, {
    expectedSuccessDelay: 8000,
    onError,
    onLoginSuccess,
    onSuccess
  })
}

/**
 * Return triggers mutations
 * @param  {Object} client CozyClient
 * @return {Object}        Object containing mutations
 */
export const triggersMutations = client => {
  return {
    createTrigger: createTrigger.bind(null, client),
    launchTrigger: launchTrigger.bind(null, client),
    watchKonnectorJob: watchKonnectorJob.bind(null, client)
  }
}

export default triggersMutations
