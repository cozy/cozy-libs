import { KonnectorJobError } from './konnectors'

/**
 * Get error for a given job document
 * @param  {Object} jobs io.cozy.jobs as returned by stack
 * @return {KonnectorJobError}         [description]
 */
export const getKonnectorJobError = job => {
    return job.state === 'errored'
      ? new KonnectorJobError(job.error)
      : null
  }


const helpers = {
    getKonnectorJobError
}
  
export default helpers
