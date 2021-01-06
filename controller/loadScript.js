const { injectFileExists } = require('../utils/fileUtils')
const fs = require('fs').promises
module.exports = async function (injectFile) {
  const injectFilePath = injectFileExists(injectFile)
  if (!injectFilePath)
    throw new Error('Inject file does not exist, please check .env settings')

  return await fs.readFile(injectFilePath, 'utf8')
}
