const parseAction = require('./parseAction')
const { stepFileExists } = require('../utils/fileUtils')
const fs = require('fs')

module.exports = function (stepFile) {
  const stepFilePath = stepFileExists(stepFile)
  if (!stepFilePath)
    throw new Error('Step file does not exist, please check .env settings')

  let steps = fs.readFileSync(stepFilePath, 'utf8')
  //   let steps = `
  // clearSiteData
  //     `
  steps = steps.split('\r\n').join('\n')
  steps = steps.split('\n')
  for (let i = steps.length - 1; i > -1; i--) {
    if (
      steps[i].trim() === '' ||
      (steps[i].length > 0 && steps[i][0] === ';')
    ) {
      steps.splice(i, 1)
    }
  }
  for (let i = 0; i < steps.length; i++) {
    const element = steps[i]
    if (element.toLowerCase().startsWith('exit')) {
      steps.splice(i, steps.length - i)
      break
    }
  }
  //parse Actions and split helper actions
  const actions = []
  for (let i = 0; i < steps.length; i++) {
    actions.push(parseAction(steps[i]))
  }
  return actions
}
