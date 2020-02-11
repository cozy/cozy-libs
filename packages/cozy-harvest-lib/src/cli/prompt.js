const readline = require('readline')

const prompt = question =>
  new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(question + ' ', answer => {
      resolve(answer)
      rl.close()
    })
  })

export const multiPrompt = async fields => {
  const responses = {}
  for (let f of fields) {
    responses[f.name] = await prompt(f.label)
  }
  return responses
}

export default prompt
