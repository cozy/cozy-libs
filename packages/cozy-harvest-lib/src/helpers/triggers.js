const DEFAULT_CRON = '0 0 0 * * 0' // Once a week, sunday at midnight

/**
 * Build trigger attributes given konnector and account
 * @param  {object} konnector
 * @param  {object} account
 * @return {object} created trigger
 */
export const buildAttributes = ({
  account,
  cron = DEFAULT_CRON,
  folder,
  konnector
}) => {
  const message = {
    account: account._id,
    konnector: konnector.slug
  }

  if (folder) {
    message['folder_to_save'] = folder._id
  }

  return {
    type: '@cron',
    arguments: cron,
    worker: 'konnector',
    message
  }
}

const helpers = {
  buildAttributes
}

export default helpers
