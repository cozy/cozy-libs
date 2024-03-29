import MicroEE from 'microee'

import { Q } from 'cozy-client'

import assert from '../../assert'
import { KonnectorJobError } from '../../helpers/konnectors'
import logger from '../../logger'
import { ERROR_EVENT, LOGIN_SUCCESS_EVENT, SUCCESS_EVENT } from '../flowEvents'

const JOBS_DOCTYPE = 'io.cozy.jobs'

const JOB_STATE_DONE = 'done'
const JOB_STATE_ERRORED = 'errored'

const DEFAULT_TIMER_DELAY = 8000

/**
 * Emits high-level events during konnector job lifecycle
 *
 * Events:
 * - error
 * - success
 * - loginSuccess
 */
export class KonnectorJobWatcher {
  /**

   *
   * @param {Object} client CozyClient
   * @param {Object} job - io.cozy.jobs document
   * @param {Number} options.expectedSuccessDelay - Time (in ms) before dispatching
   * a `LOGIN_SUCESS` event if nothing was received before this delay
   * (error, success or login success). It means that if the login process takes
   * more than this time, we will have a "success" event if it's not really the case.
   */
  constructor(client, job, options = {}) {
    this.client = client
    this.realtime = client.plugins.realtime
    this.job = job
    assert(this.job._id, 'No job id')

    /**
     * Options
     *  expectedSuccessDelay: delay for login timer in ms
     */
    const { expectedSuccessDelay = DEFAULT_TIMER_DELAY } = options
    this.options = {
      ...options,
      expectedSuccessDelay
    }
    this.successTimer = null

    this._error = null
    this._succeed = false

    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleError = this.handleError.bind(this)
    this.handleSuccessDelay = this.handleSuccessDelay.bind(this)
    this.disableSuccessTimer = this.disableSuccessTimer.bind(this)
    this.handleJobUpdated = this.handleJobUpdated.bind(this)
  }

  handleError(error) {
    logger.info(`KonnectorJobWatcher: Job has encountered an error`)
    this.disableSuccessTimer()
    this._error = error
    this.emit(ERROR_EVENT, new KonnectorJobError(error))
  }

  handleLoginSuccess() {
    logger.info(`KonnectorJobWatcher: login success`)
    this.disableSuccessTimer()
  }

  handleSuccess() {
    logger.info(`KonnectorJobWatcher: Job has succeeded`)
    this.disableSuccessTimer()
    if (this._error || this._succeed) return
    this._succeed = true
    this.emit(SUCCESS_EVENT, this.job)
  }

  handleSuccessDelay() {
    logger.info(
      `KonnectorJobWatcher: Job has ran for ${DEFAULT_TIMER_DELAY}ms without error, considering success`
    )
    this.disableSuccessTimer()
    if (this._error || this._succeed) return

    this.emit(LOGIN_SUCCESS_EVENT, this.job)
  }

  disableSuccessTimer() {
    logger.info(`KonnectorJobWatcher: Disabling auto success timer`)
    if (this.successTimer) {
      logger.info(`KonnectorJobWatcher: Disabling auto success timer`)
      clearTimeout(this.successTimer)
      this.successTimer = null
    }
  }

  enableSuccessTimer(time) {
    if (!this.successTimer) {
      logger.info(`KonnectorJobWatcher: Enabling auto success timer`)
      this.successTimer = setTimeout(
        this.handleSuccessDelay,
        time || this.options.expectedSuccessDelay
      )
    }
  }

  handleJobUpdated(job) {
    if (this._succeed || this._error) return
    this.job = job
    const { state } = this.job
    if (state === JOB_STATE_DONE) this.handleSuccess(this.job)
    if (state === JOB_STATE_ERRORED) this.handleError(this.job.error)
  }

  async watch(options = {}) {
    if (options.autoSuccessTimer !== false) {
      this.enableSuccessTimer()
    } else {
      logger.info('KonnectorJobWatcher: Watching job without success timer')
    }

    // It's important to wait here because we want to be sure that the realtime
    // has subscribed to job changes before we fetch the last revision manually.
    // Otherwise the job could still be updated before the subscribe end and
    // after the last revision fetch.
    await this.realtime.subscribe(
      'updated',
      JOBS_DOCTYPE,
      this.job._id,
      this.handleJobUpdated
    )

    // Retrieves the last revision of the job in case we missed an update during
    // realtime subscription.
    const jobResponse = await this.client.query(
      Q('io.cozy.jobs').getById(this.job._id)
    )

    this.handleJobUpdated(jobResponse.data)
  }

  unsubscribeAll() {
    this.realtime.unsubscribe(
      'updated',
      JOBS_DOCTYPE,
      this.job._id,
      this.handleJobUpdated
    )
  }
}

export const watchKonnectorJob = (client, job, options) => {
  const jobWatcher = new KonnectorJobWatcher(client, job)
  // no need to await realtime initializing here
  jobWatcher.watch(options)
  return jobWatcher
}

MicroEE.mixin(KonnectorJobWatcher)

export default KonnectorJobWatcher
