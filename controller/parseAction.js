module.exports = function (actionStr) {
  if (actionStr[0] === '/') {
    actionStr = actionStr.substring(1)
  }
  const action = { path: '', params: [] }
  //REPLACE env vars
  let actionParts = actionStr.split('@@@')
  for (let i = 0; i < actionParts.length; i++) {
    const element = actionParts[i]
    if (process.env[element]) {
      actionParts[i] = process.env[element]
    }
  }
  actionStr = actionParts.join('')

  const queryPos = actionStr.indexOf('?')
  if (queryPos === -1) {
    action.path = actionStr
    return action
  }
  action.path = actionStr.substring(0, queryPos)
  const paramPos = actionStr.indexOf('?params=')
  if (paramPos === -1) {
    //assume query is param
    action.params = [actionStr.substring(queryPos + 1)]
  } else {
    try {
      action.params = JSON.parse(actionStr.substring(queryPos + 8))
    } catch (e) {
      throw new Error('params must be a JSON array')
    }
    if (!Array.isArray(action.params)) {
      throw new Error('params must be a JSON array')
    }
  }

  return action
}
