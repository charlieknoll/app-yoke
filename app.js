require('dotenv').config()
const express = require('express')
const { browserController, parseAction } = require('./controller')
const asyncHandler = require('express-async-handler')
const { Router, query } = require('express')

const app = express()
const hostname = process.env.HOST
const port = process.env.PORT

app.get(
  '*',
  asyncHandler(async function (req, res, next) {
    action = parseAction(req.url)

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
    await browserController.goto(req.query.url)
    res.send(`navigated to: ${req.query.url}`)
  }),
)
app.get('/test', function (req, res) {
  res.send('match test')
})
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}`)
})
