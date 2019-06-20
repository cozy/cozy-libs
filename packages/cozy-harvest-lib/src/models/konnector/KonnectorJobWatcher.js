import MicroEE from 'microee'

import CozyRealtime from 'cozy-realtime'
import { KonnectorJobError } from '../../helpers/konnectors'

const JOBS_DOCTYPE = 'io.cozy.jobs'

const JOB_STATE_DONE = 'done'
const JOB_STATE_ERRORED = 'errored'

const DEFAULT_TIMER_DELAY = 8000

export class KonnectorJobWatcher {
  constructor(client, job, options = {}) {
    this.client = client
    this.realtime = new CozyRealtime({ client })
    this.job = job
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
    this.disableSuccessTimer()
    this._error = error
    this.emit('error', new KonnectorJobError(error))
  }

  handleSuccess() {
    this.disableSuccessTimer()
    if (this._error || this._succeed) return
    this._succeed = true
    this.emit('success', this.job)
  }

  handleSuccessDelay() {
    this.disableSuccessTimer()
    if (this._error || this._succeed) return

    this.emit('loginSuccess', this.job)
  }

  disableSuccessTimer() {
    if (this.successTimer) {
      clearTimeout(this.successTimer)
      this.successTimer = null
    }
  }

  enableSuccessTimer(time) {
    if (!this.successTimer) {
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

  async watch() {
    this.enableSuccessTimer()

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
      this.client.get('io.cozy.jobs', this.job._id)
    )

    this.handleJobUpdated(jobResponse.data)
  }

  unsubscribeAll() {
    this.realtime.unsubscribeAll()
  }
}

MicroEE.mixin(KonnectorJobWatcher)

export default KonnectorJobWatcher
