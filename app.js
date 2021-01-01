require('dotenv').config()
const express = require('express')
const {
  browserController,
  parseAction,
  parseStepFile,
} = require('./controller')
const asyncHandler = require('express-async-handler')
const { Router, query } = require('express')

const app = express()
const hostname = process.env.HOST
const port = process.env.PORT

app.get(
  '*',
  asyncHandler(async function (req, res, next) {
    const actionStr = req.query.params
      ? req.path + '?params=' + req.query.params
      : req.url
    const action = parseAction(actionStr)

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
        invalidActions.push(
          stepAction.path +
            (stepAction.params ? '?' : '') +
            `${stepAction.params}`,
        )
      }
    }

    if (invalidActions.length > 0) {
      return res.status(404).send({
        message:
          'The following steps could not be found: ' + invalidSteps.join('/n'),
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
