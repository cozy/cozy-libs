const fetch = require('node-fetch')

const symbolBySeverity = {
  warn: '⚠️',
  success: '✅',
  error: '🚩',
  info: 'ℹ️'
}

class MattermostReporter {
  constructor(config) {
    this.config = config
    this.checkEnv()
    this.messages = []
  }

  checkEnv() {
    if (!process.env.MATTERMOST_HOOK) {
      throw new Error(
        'To be instantiated, mattermost reporter needs process.env.MATTERMOST_HOOK'
      )
    }
  }

  write(msg) {
    this.messages.push(msg)
  }

  async sendAllMessages() {
    const payload = {
      channel: this.config.channel,
      text: this.messages
        .map(x => {
          const symbol = symbolBySeverity[x.severity]
          return `${x.type || ''} ${symbol || ''} ${x.message}`
        })
        .join('\n')
    }

    await fetch(process.env.MATTERMOST_HOOK, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async flush() {
    await this.sendAllMessages()
    this.messages = []
  }
}

module.exports = MattermostReporter
