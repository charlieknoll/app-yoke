const express = require('express')
const config = require('./config')
const {
  browserController,
  parseAction,
  parseStepFile,
} = require('./controller')
const asyncHandler = require('express-async-handler')
const { Router, query } = require('express')

const app = express()
const hostname = config.HOST
const port = config.PORT

app.get(
  '*',
  asyncHandler(async function (req, res, next) {
    await browserController.init()
    const action = parseAction(decodeURI(req.url))
    if (browserController.logToConsole) {
      await browserController.info(action.path, action.params)
    }
    if (browserController[action.path]) {
      try {
        const result = await browserController[action.path](...action.params)
        res.send('success')
      } catch (e) {
        await browserController.error(e.message, { stack: e.stack })
        res.send('failure')
      }
    } else {
      return next()
    }
  }),
)
app.get(
  '/step-file',
  asyncHandler(async function (req, res) {
    await browserController.init()
    const action = parseAction(req.url)
    const actions = parseStepFile(action.params[0])
    await browserController.info(action.path, action.params)
    let invalidActions = []
    let result = false
    let stepFileSuccess = true
    for (let i = 0; i < actions.length; i++) {
      const stepAction = actions[i]
      if (browserController.logToConsole) {
        await browserController.info(stepAction.path, stepAction.params)
      }
      const fn =
        browserController[stepAction.path] || browserController.defaultHandler
      browserController[stepAction.path]
        ? stepAction.params
        : stepAction.params.unshift(stepAction.path)
      try {
        result = await fn.bind(browserController)(...stepAction.params)
        if (!result) {
          await browserController.error('failed: ' + stepAction.path)
          stepFileSuccess = false
          if (browserController.breakOnFailedStep) break
        }
      } catch (e) {
        await browserController.error(e.message, { stack: e.stack })
        stepFileSuccess = false
        if (browserController.breakOnFailedStep) break
      }
    }

    if (!stepFileSuccess) {
      return res.status(404).send({
        message: 'One or more steps failed, see browser console for details',
      })
    } else {
      res.send('success')
    }
  }),
)
app.get('*', async function (req, res) {
  await browserController.init()
  const msg = `Incorrect request format: ${req.url}
    Use either /actionName?value, /actionName?params=JSONParams or /step-file?filename`
  await browserController.error(msg)
  res.send(msg)
})
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})
