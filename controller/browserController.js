const config = require('../config')
const pageProvider = require('./pageProvider')
const client = () => pageProvider.client
const page = () => pageProvider.page

function _sleep(ms) {
  console.log('sleep: ' + ms)
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
    await page().evaluate(
      (s, clickOptions) => {
        document.querySelector(s).click()
      },
      selector,
      clickOptions,
    )
  },
  waitForClick: async function (selector, clickOptions) {
    await this.waitForSelector(selector)
    await this.click(selector, clickOptions)
  },
  type: async function (selector, text, options) {
    options = options || { delay: 50 }
    await page().type(selector, text, options)
  },
  defaultHandler: async function () {
    const args = Array.from(arguments)

    if (args.length == 0) throw new Error('Page function not specified')
    if (!page()[args[0]] && !page().keyboard[args[0]])
      throw new Error('Invalid page or keyboard function: ' + args[0])
    const action = args.splice(0, 1)[0]
    if (page()[action]) {
      await page()[action](...args)
      return
    }
    await page().keyboard[action](...args)
  },
  press: async function (selector, keys, options) {
    await page().focus(selector)
    const modifierKeys = ['Control', 'Shift', 'Alt']
    keys = keys.split(',')
    for (const k of keys) {
      if (modifierKeys.indexOf(k) > -1) {
        await page().keyboard.down(k)
      } else {
        await page().keyboard.press(k, options)
      }
    }
    for (const k of keys) {
      if (modifierKeys.indexOf(k) > -1) {
        await page().keyboard.up(k)
      }
    }
  },
  evaluate: async function (js) {
    await page().evaluate(() => {
      window.alert('hello test')
    })
  },
  evaluateValue: async function (js, value) {
    const retValue = await page().evaluate(js)
    if (value === retValue) {
      console.log('matched')
    }
  },
  loadScript: async function () {},
  clearStorage: async function (types) {
    await client().send('Storage.clearDataForOrigin', {
      origin: process.env.DEBUG_ORIGIN,
      storageTypes: types,
    })
  },
  reload: async function (clearCache = true) {
    if (clearCache) {
      await this.clearStorage('cache_storage')
    }
    await page().evaluate(() => {
      window.location.reload()
    })
  },
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
