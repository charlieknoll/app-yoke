const path = require('path')
const fs = require('fs')

require('dotenv').config()
if (process.env.PROJECT_PATH !== undefined) {
  const projectPath = path.resolve(
    `${process.env.PROJECT_PATH}/app-yoke`,
    '.env',
  )
  try {
    if (fs.existsSync(projectPath)) {
      require('dotenv').config({
        path: projectPath,
      })
    } else {
      process.env.PROJECT_PATH = ''
    }
  } catch (err) {
    console.error(err)
    process.env.PROJECT_PATH = ''
  }
}
module.exports = process.env
