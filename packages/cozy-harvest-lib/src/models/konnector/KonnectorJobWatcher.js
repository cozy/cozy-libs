import { subscribe } from 'cozy-realtime'

const JOBS_DOCTYPE = 'io.cozy.jobs'

const JOB_STATE_DONE = 'done'
const JOB_STATE_ERRORED = 'errored'

export class KonnectorJobWatcher {
  constructor(
    client,
    job,
    { expectedSuccessDelay, onError, onLoginSuccess, onSuccess }
  ) {
    this.client = client
    this.job = job

    this.expectedSuccessDelay = expectedSuccessDelay
    this.onError = onError
    this.onLoginSuccess = onLoginSuccess
    this.onSuccess = onSuccess

    this._error = null
    this._succeed = false

    this.handleSuccessDelay = this.handleSuccessDelay.bind(this)

    this.watch()
  }

  handleError(error) {
    this._error = error
    this.onError(error)
  }

  handleSuccess() {
    if (this._error || this._succeed) return
    this._succeed = true
    this.onSuccess(this.job)
  }

  handleSuccessDelay() {
    if (this._error || this._succeed) return

    this._succeed = true
    return this.onLoginSuccess(this.job)
  }

  async watch() {
    const jobSubscription = await subscribe(
      {
        // Token structure differs between web and mobile
        token:
          this.client.stackClient.token.token ||
          this.client.stackClient.token.accessToken,
        url: this.client.options.uri
      },
      JOBS_DOCTYPE,
      { docId: this.job._id }
    )

    jobSubscription.onUpdate(updatedJob => {
      if (this.succeed || this.error) return
      this.job = updatedJob
      const { state } = this.job
      if (state === JOB_STATE_DONE) this.handleSuccess(this.job)
      if (state === JOB_STATE_ERRORED) this.handleError(this.job.error)
    })

    setTimeout(this.handleSuccessDelay, this.expectedSuccessDelay)
  }
}
