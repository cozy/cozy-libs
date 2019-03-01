import { subscribe } from 'cozy-realtime'

const JOBS_DOCTYPE = 'io.cozy.jobs'
const TRIGGERS_DOCTYPE = 'io.cozy.triggers'

const JOB_END_STATES = ['done', 'errored']

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
      token: client.client.token.token,
      domain: client.client.uri,
      secure: window.location.protocol === 'https:'
    },
    JOBS_DOCTYPE,
    job
  )

  return new Promise(resolve => {
    setTimeout(() => resolve(job), expectedSuccessDelay)
    jobSubscription.onUpdate(
      realtimeJob =>
        JOB_END_STATES.includes(realtimeJob.state) && resolve(realtimeJob)
    )
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
    waitForLoginSuccess: waitForLoginSuccess.bind(null, client)
  }
}

export default triggersMutations
