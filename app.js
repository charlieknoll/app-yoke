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
    const action = parseAction(decodeURI(req.url))

    if (browserController[action.path]) {
      await browserController[action.path](...action.params)
      res.send('success')
    } else {
      return next()
    }
  }),
)
app.get(
  '/step-file',
  asyncHandler(async function (req, res) {
    const action = parseAction(req.url)
    const actions = parseStepFile(action.params[0])

    let invalidActions = []
    for (let i = 0; i < actions.length; i++) {
      const stepAction = actions[i]
      if (browserController[stepAction.path]) {
        await browserController[stepAction.path](...stepAction.params)
      } else {
        try {
          await browserController.defaultHandler(
            stepAction.path,
            ...stepAction.params,
          )
        } catch (e) {
          invalidActions.push(
            stepAction.path +
              (stepAction.params ? '?' : '') +
              `${stepAction.params}`,
          )
        }
      }
    }

    if (invalidActions.length > 0) {
      return res.status(404).send({
        message:
          'The following steps could not be executed, did you specify a valid page or keyboard action? Invalid steps: ' +
          invalidActions.join('/n'),
      })
    } else {
      res.send('success')
    }
  }),
)
app.get('/test', function (req, res) {
  res.send('match test')
})
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})
