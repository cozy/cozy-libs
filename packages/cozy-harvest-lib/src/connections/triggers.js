import { subscribe } from 'cozy-realtime'

import { KonnectorJobError } from '../helpers/konnectors'

const JOBS_DOCTYPE = 'io.cozy.jobs'
const TRIGGERS_DOCTYPE = 'io.cozy.triggers'

const JOB_STATE_DONE = 'done'
const JOB_STATE_ERRORED = 'errored'

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

/**
 * Waits for successful login. For now we are not able to know in real time
 * if the login was successful or not. We consider that after a sufficient
 * delay, the konnector has successfully logged in and is now in the data
 * fetching phase.
 * The default login delay is 8 seconds.
 * In the future, the realtime login detection will be performed in this
 * method.
 * @param  {Object} client CozyClient
 * @param  {Object}  job               io.cozy.jobs document
 * @param  {Number}  [expectedSuccessDelay=8000] Delay, in ms, until the login is
 * considered as sucessful.
 * @return {Object}                    The executed job
 */
const waitForLoginSuccess = async (
  client,
  job,
  expectedSuccessDelay = 8000
) => {
  const jobSubscription = await subscribe(
    {
      // Token structure differs between web and mobile
      token:
        client.stackClient.token.token || client.stackClient.token.accessToken,
      url: client.options.uri
    },
    JOBS_DOCTYPE,
    { docId: job._id }
  )

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(job), expectedSuccessDelay)
    jobSubscription.onUpdate(
      updatedJob =>
        (updatedJob.state === JOB_STATE_DONE && resolve(updatedJob)) ||
        (updatedJob.state === JOB_STATE_ERRORED &&
          reject(new Error(updatedJob.error)))
    )
  })
}

const watchKonnectorJob = async (
  client,
  job,
  { onError, onSuccess, onLoginSuccess }
) => {
  let updatedJob

  try {
    updatedJob = await waitForLoginSuccess(job)
  } catch (error) {
    typeof onError === 'function' &&
      onError(new KonnectorJobError(error.message))
  }

  if (['queued', 'running'].includes(updatedJob.state)) {
    return typeof onLoginSuccess === 'function' && onLoginSuccess(updatedJob)
  }

  return typeof onSuccess === 'function' && onSuccess(updatedJob)
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
