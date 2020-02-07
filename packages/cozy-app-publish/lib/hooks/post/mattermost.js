const https = require('https')
const url = require('url')

const appTypeLabelMap = {
  webapp: 'Application',
  konnector: 'Connector'
}

const makeGithubCommitsURL = (repoSlug, commitSha) => {
  return `https://github.com/${repoSlug}/commits/${commitSha}`
}

const getMessage = options => {
  const { appSlug, appVersion, spaceName, appType } = options
  const {
    TRAVIS_COMMIT_MESSAGE,
    TRAVIS_JOB_WEB_URL,
    TRAVIS_REPO_SLUG,
    TRAVIS_COMMIT
  } = process.env
  const spaceMessage = spaceName ? ` on space __${spaceName}__` : ''
  const infos = [
    TRAVIS_COMMIT_MESSAGE
      ? `- [Last commit: ${
          TRAVIS_COMMIT_MESSAGE.split('\n')[0]
        }](${makeGithubCommitsURL(TRAVIS_REPO_SLUG, TRAVIS_COMMIT)})`
      : null,
    TRAVIS_JOB_WEB_URL ? `- [Job](${TRAVIS_JOB_WEB_URL})` : null
  ]
    .filter(Boolean)
    .join('\n')
  const message = `${appTypeLabelMap[appType] ||
    ''} __${appSlug}__ version \`${appVersion}\` has been published${spaceMessage}.${
    infos.length > 0 ? '\n\n' + infos : ''
  }`
  return message
}

const sendMattermostReleaseMessage = (
  appSlug,
  appVersion,
  spaceName,
  appType
) => {
  const { MATTERMOST_CHANNEL, MATTERMOST_HOOK_URL } = process.env

  const MATTERMOST_ICON =
    'https://travis-ci.com/images/logos/TravisCI-Mascot-1.png'
  const MATTERMOST_USERNAME = 'Travis'

  const mattermostHookUrl = url.parse(MATTERMOST_HOOK_URL)
  const message = getMessage({
    appSlug,
    appVersion,
    spaceName,
    appType
  })
  return new Promise((resolve, reject) => {
    console.log(
      `↳ ℹ️  Sending to mattermost channel ${MATTERMOST_CHANNEL} the following message: "${message}"`
    )
    const postData = JSON.stringify({
      channel: MATTERMOST_CHANNEL,
      icon_url: MATTERMOST_ICON,
      username: MATTERMOST_USERNAME,
      text: message
    })
    const request = https.request(
      {
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        hostname: mattermostHookUrl.hostname,
        method: 'post',
        path: mattermostHookUrl.pathname
      },
      res => {
        if (res.statusCode === 200) {
          resolve(res)
        } else {
          reject(
            new Error(
              `Mattermost message sending failed (error status: ${res.statusCode}) and message : ${res.statusMessage}.`
            )
          )
        }
      }
    )
    request.on('error', error => reject(error))
    request.write(postData)
    request.end()
  })
}

module.exports = async options => {
  console.log('↳ ℹ️  Sending message to Mattermost')
  const MATTERMOST_HOOK_URL = process.env.MATTERMOST_HOOK_URL

  if (!MATTERMOST_HOOK_URL) {
    throw new Error('No MATTERMOST_HOOK_URL environment variable defined')
  }

  const { appSlug, appVersion, spaceName, appType } = options

  sendMattermostReleaseMessage(appSlug, appVersion, spaceName, appType)

  return options
}

module.exports.getMessage = getMessage
module.exports.sendMattermostReleaseMessage = sendMattermostReleaseMessage
