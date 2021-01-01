const parseAction = require('./parseAction')

module.exports = function (stepFile) {
  // TODO load from file
  let steps = `
clearSiteData
    `

  steps = steps.split('\n')
  for (let i = steps.length - 1; i > -1; i--) {
    if (steps[i].trim() === '') {
      steps.splice(i, 1)
    }
  }
  //parse Actions and split helper actions
  const actions = []
  for (let i = 0; i < steps.length; i++) {
    actions.push(parseAction(steps[i]))
  }
  return actions
}
