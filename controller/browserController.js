const pageProvider = require('./pageProvider')
const client = () => pageProvider.client
const page = () => pageProvider.page

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const browserController = {
  // evaluate: async function (js) {
  //   await page.evaluate()
  // },
  sleep: async function (ms) {
    function _sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }
    await _sleep(ms)
  },
  clearSiteData: async function () {
    await client().send('Storage.clearDataForOrigin', {
      origin: process.env.DEBUG_ORIGIN,
      storageTypes:
        'appcache,cache_storage,cookies,indexeddb,local_storage,service_workers,websql',
    })
  },
  click: async function (selector) {
    const el = await page.selector(selector)
    await el.click()
  },
  loadScript: async function () {},
  reload: async function () {},
  waitFor: async function (eval) {},
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
