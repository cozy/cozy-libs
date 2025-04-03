const getGithubActionsVariables = () => {
  return {
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE,
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
    GITHUB_SHA: process.env.GITHUB_SHA,
    GITHUB_REF_NAME: process.env.GITHUB_REF_NAME,
    GITHUB_REF_TYPE: process.env.GITHUB_REF_TYPE,
    REGISTRY_TOKEN: process.env.REGISTRY_TOKEN
  }
}

module.exports = getGithubActionsVariables