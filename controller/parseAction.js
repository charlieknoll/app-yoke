module.exports = function (actionStr) {
  if (actionStr[0] === '/') {
    actionStr = actionStr.substring(1)
  }
  const action = { path: '', params: [] }

  const queryPos = actionStr.indexOf('?')
  if (queryPos === -1) {
    action.path = actionStr
    return
  }
  action.path = actionStr.substring(0, queryPos)
  const paramPos = actionStr.indexOf('?params')
  if (paramPos === -1) {
    //assume query is param
    action.params = [actionStr.substring(queryPos + 1)]
  } else {
    try {
      action.params = JSON.parse(actionStr.substring(queryPos + 7))
    } catch (e) {
      throw new Error('params must be a JSON array')
    }
    if (typeof params !== Array) {
      throw new Error('params must be a JSON array')
    }
  }

  return action
}
