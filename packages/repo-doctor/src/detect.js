const fs = require('fs')
const path = require('path')

const githubHttpRepo = /url = https:\/\/github.com\/([a-z-\\/]+)/
const githubGitRepo = /url = git@github.com:([a-z-\\/]+)/

const detectRegexes = [githubHttpRepo, githubGitRepo]

const matchFirst = (string, regexes) => {
  for (let rx of regexes) {
    const match = rx.exec(string)
    if (match) {
      return match
    }
  }
}

const autoDetectRepository = async () => {
  try {
    const gitConfig = fs
      .readFileSync(path.join(process.cwd(), '.git/config'))
      .toString()
    const match = matchFirst(gitConfig, detectRegexes)
    if (match) {
      return match[1]
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

module.exports = {
  autoDetectRepository
}
