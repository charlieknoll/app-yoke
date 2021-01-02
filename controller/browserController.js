const config = require('../config')
const pageProvider = require('./pageProvider')
const client = () => pageProvider.client
const page = () => pageProvider.page

function _sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const browserController = {
  // evaluate: async function (js) {
  //   await page.evaluate()
  // },
  sleep: async function (ms) {
    // function _sleep(ms) {
    //   return new Promise((resolve) => setTimeout(resolve, ms))
    // }
    await _sleep(ms)
  },
  clearSiteData: async function () {
    await client().send('Storage.clearDataForOrigin', {
      origin: process.env.DEBUG_ORIGIN,
      storageTypes:
        'appcache,cache_storage,cookies,indexeddb,local_storage,service_workers,websql',
    })
  },
  click: async function (selector, clickOptions, waitOptions) {
    // var p1 = page().click(selector, clickOptions)
    // const p2 = page().waitForNavigation(waitOptions)
    // await _sleep(1000)
    // const [response] = await Promise.all([p1])

    await page().click(selector, clickOptions)
  },
  type: async function (selector, text, options) {
    options = options || { delay: 100 }
    await page().type(selector, text, options)
  },

  press: async function () {
    //TODO parse out modifiers
  },

  loadScript: async function () {},
  reload: async function () {},
  waitForSelector: async function (selector) {
    const sleepMs = 250
    let cycles = 0
    const maxCycles = config.WAIT_FOR_SELECTOR / sleepMs
    let el = await page().$(selector)
    while (!el && cycles < maxCycles) {
      cycles++
      await _sleep(sleepMs)
      el = await page().$(selector)
    }
    return true
  },
  enableNetwork: async function () {},
  disableNetwork: async function () {},
  goto: async function (url, options) {
    try {
      await page().goto(url, options)
      return true
    } catch (e) {
      console.log('goto error: ', e)
      return false
    }
  },
  gotoWaitFor: async function (
    url,
    waitUntil = 'load',
    eval = 'document.ready',
  ) {
    await this.goto(url, waitUntil)
    await this.waitFor(eval)
  },
}

module.exports = browserController
