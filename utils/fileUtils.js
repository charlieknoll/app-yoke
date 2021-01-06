const fs = require('fs')
const path = require('path')
const config = require('../config')
const fileExists = function (path) {
  try {
    if (fs.existsSync(path)) {
      return true
    }
  } catch (err) {
    console.error(err)
  }
  return false
}
const stepFileExists = function (fileName) {
  const stepFilePath = path.join(
    config.PROJECT_PATH,
    'app-yoke/step-files',
    fileName,
  )
  return fileExists(stepFilePath) ? stepFilePath : false
}
const injectFileExists = function (fileName) {
  const injectFilePath = path.join(
    config.PROJECT_PATH,
    'app-yoke/inject',
    fileName,
  )
  return fileExists(injectFilePath) ? injectFilePath : false
}

module.exports = { fileExists, stepFileExists, injectFileExists }
