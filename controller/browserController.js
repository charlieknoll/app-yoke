const config = require('../config')
const pageProvider = require('./pageProvider')

function _sleep(ms) {
  console.log('sleep: ' + ms)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const browserController = {
  page: null,
  client: null,
  logToConsole: false,
  init: async function (force) {
    if (!this.page || force) {
      await pageProvider.init()
    }
    this.client = pageProvider.client
    this.page = pageProvider.page
  },
  info: async function (message, obj) {
    this.page.evaluate(
      (message, obj) => {
        console.log('AppYokeInfo: ' + message, obj)
      },
      message,
      obj,
    )
    return true
  },
  error: async function (message, obj) {
    this.page.evaluate(
      (message, obj) => {
        console.error('AppYokeError: ' + message, obj)
      },
      message,
      obj,
    )
    return true
  },

  console: async function (enable) {
    this.logToConsole = enable
    this.info('console logging enabled')
  },
  sleep: async function (ms) {
    await _sleep(ms)
    return true
  },
  clearSiteData: async function () {
    await this.client.send('Storage.clearDataForOrigin', {
      origin: process.env.DEBUG_ORIGIN,
      storageTypes:
        'appcache,cache_storage,cookies,indexeddb,local_storage,service_workers,websql',
    })
    return true
  },
  click: async function (selector, clickOptions) {
    return await this.page.evaluate(
      (s, clickOptions) => {
        let el = document.querySelector(s)
        if (el == null) return false

        el.click()
        return true
      },
      selector,
      clickOptions,
    )
  },

  waitForClick: async function (selector, clickOptions) {
    const foundEl = await this.waitForSelector(selector)
    if (foundEl) {
      await this.click(selector, clickOptions)
      return true
    }
    return false
  },
  type: async function (selector, text, options) {
    options = options || { delay: 50 }
    await this.page.type(selector, text, options)
    return true
  },
  defaultHandler: async function () {
    const args = Array.from(arguments)

    if (args.length == 0) throw new Error('Page function not specified')
    const page = this.page
    if (!page[args[0]] && !page.keyboard[args[0]])
      throw new Error('Invalid page or keyboard function: ' + args[0])
    const action = args.splice(0, 1)[0]
    if (page[action]) {
      await page[action](...args)
      return true
    }
    await page.keyboard[action](...args)
    return true
  },
  press: async function (selector, keys, options) {
    await this.page.focus(selector)
    const modifierKeys = ['Control', 'Shift', 'Alt']
    keys = keys.split(',')
    for (const k of keys) {
      if (modifierKeys.indexOf(k) > -1) {
        await this.page.keyboard.down(k)
      } else {
        await this.page.keyboard.press(k, options)
      }
    }
    for (const k of keys) {
      if (modifierKeys.indexOf(k) > -1) {
        await this.page.keyboard.up(k)
      }
    }
    return true
  },
  evaluateValue: async function (js, value) {
    const retValue = await this.page.evaluate(js)
    return (value === retValue && value !== undefined) || retValue == true
  },
  waitForEvaluateValue: async function (js, value) {
    const sleepMs = 250
    let cycles = 0
    const maxCycles = config.WAIT_FOR_TIMEOUT / sleepMs
    let matched = await this.evaluateValue(js, value)
    while (!matched && cycles < maxCycles) {
      cycles++
      await _sleep(sleepMs)
      matched = await this.evaluateValue(js, value)
    }
    return matched
  },
  loadScript: async function () {},
  clearStorage: async function (types) {
    await this.client.send('Storage.clearDataForOrigin', {
      origin: process.env.DEBUG_ORIGIN,
      storageTypes: types,
    })
    return true
  },
  reload: async function (clearCache = true) {
    if (clearCache) {
      await this.clearStorage('cache_storage')
    }
    await this.page.evaluate(() => {
      window.location.reload()
    })
    await this.init(true)
    return true
  },
  waitForSelector: async function (selector, timeout) {
    const sleepMs = 250
    let cycles = 0
    const maxCycles = timeout || config.WAIT_FOR_TIMEOUT / sleepMs
    let el = await this.page.$(selector)
    while (!el && cycles < maxCycles) {
      cycles++
      await _sleep(sleepMs)
      el = await this.page.$(selector)
    }
    return el != null
  },
  network: async function (enable) {
    enable = enable == 'true' ? true : false
    await this.client.send('Network.emulateNetworkConditions', {
      offline: !enable,
      downloadThroughput: -1,
      latency: 0,
      uploadThroughput: -1,
      connectionType: enable ? 'ethernet' : 'none',
    })
    return true
  },
  clickText: async function (selector) {
    const parts = selector.split('>')
    if (parts.length !== 2) return null
    const s = parts[0].trim()
    const t = parts[1].trim()

    return await this.page.evaluate(
      (s, t) => {
        const nodes = document.querySelectorAll(s)
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i]
          if (n.innerText.toLowerCase() == t.toLowerCase()) {
            n.click()
            return true
          }
        }
        return false
      },
      s,
      t,
    )
  },

  // goto: async function (url, options) {
  //   try {
  //     await this.page.goto(url, options)
  //     return true
  //   } catch (e) {
  //     console.log('goto error: ', e)
  //     return false
  //   }
  // },
  // gotoWaitFor: async function (
  //   url,
  //   waitUntil = 'load',
  //   eval = 'document.ready',
  // ) {
  //   await this.goto(url, waitUntil)
  //   await this.waitForEvaluateValue(eval)
  // },
}

module.exports = browserController
