# chrome-dev-tools-controller

## Requirements

- node.js
- <a href="https://www.autohotkey.com/" target="_blank">autohotkey</a> (optional)

## Getting Started

### Setting up AppYoke

```
git clone https://github.com/charlieknoll/app-yoke.git
cd app-yoke
npm install
cp .env.example .env
```

- Configure the DEBUG_ORIGIN in the .env file (e.g. http://localhost:8081)
- Configure the PROJECT_PATH in the .env file (/dev/app-yoke/example-project) if running the example project

```
node app.js
```

### Configuring your target project

- Copy the app-yoke/example-project/app-yoke folder to your target project
- Start up your local web server or debug in vs code (e.g. your app running on localhost:8080)
- Start brave, edge or chrome with remote-debugging flag set (see chrome.bat)
- Navigate to your debugging url (e.g. localhost:8080)

> **IMPORTANT:** Be sure to close all instances of your testing browser before starting in debugger mode.

```
curl localhost:3000/step-file?pwa-reload.txt 
```

## Step File Commands

AppYoke provides a number of custom actions on top of the default <a href="https://chromedevtools.github.io/devtools-protocol/tot/Page/" target="_blank">page</a> actions and keyboard actions.

### Additional Actions

Note: all "waitFor..." actions respect the WAIT_FOR_TIMEOUT value in the .env file

```clearSiteStorage```: Uses the Storage.clearDataForOrigin through the CDPSession passing these storage types: ```appcache,cache_storage,cookies,indexeddb,local_storage,service_workers,websql```

```clearStorage(types)```: Uses the Storage.clearDataForOrigin through the CDPSession passing the types argument for storage types

```reload(forceReload)```: By default clears cache using ```clearStorage('cache_stoage')``` then uses page evaluate to run window.location.reload()

```waitForSelector(selector)```: Waits for the selector to resolve to an element on the page

```sleep(ms)```: Pauses the stepfile for the specified number of milliseconds

```evaluateValue(js,value)```: Pass a javascript string which evaluates to a value and 

```network(enable)```: Enables/disables netork

```notifications(ask/block/allow)```: Site notifications settings

### Enhanced Actions

```click```: Uses page.evaluate => document.querySelector(selector).click() instead of page.click()

```press(selector,keys,options)```:  Pass a comma delimited list and keyboard.down/up will be sent for the modifier keys and keyboard.press will be used for non modifier keys. Useful for highlighting an existing value before typing text into and input. E.g. "Control,a" would highlight existing text sending keyboard.down("Control"), keyboard.press("a") and keyboard.up("Control"). Subsequent "type" call would overwrite the text in the field. Also CHAR(charCode) will be converted to the char code. E.g. CHAR(13) will send the enter key.

### Combination Actions

```waitForClick(selector,clickOptions)```: A combination of the additional action waitForSelector and page.click. Helpful when navigating between pages

```waitForPress(selector,text)```: A combination of the additional action waitForSelector and the enhanced action press. Helpful when navigating between pages.

```waitForEvaluateValue(js,value)```: Waits for the passed javascript string to evaluate to value 
## AppYoke Project Folder Format

See the example-project/app-yoke for an example

## Step File Format

Actions can be called in 2 ways:
- action?singleParam (e.g. sleep?500)
- action?params=JSON array (e.g. sleep?params="["sleep": "500"]")

Comment lines by place

## Examples

Are you tired of clearing site data, clearing notification settings, reloading page, reloading again to populate data, logging in, disabling/enabling network and repeating over and over again as you test your application?  If so, set up a steps file and hook it up with a hot key to get instant automation of the steps.

```
clearSiteData
goto?params=["http://localhost:8081?apikey=@@@API_KEY@@@", {"waitUntil": "load"}]
waitForClick?div.q-banner[name="settings-banner"] button[tabindex="0"]
reload
sleep?2000
reload
network?false
reload
```

## Tips

It can be helpful to create a separate brave/chrome profile for debugging with only the necessary extensions installed to support debugging.  Some extensions e.g. adblockers, password managers, etc can pollute the DOM and make it difficult to inspect elements cleanly.  See the scripts in the ```./bin``` folder for examples.

When developing SPA's the document.ready will always evaluate to true because the SPA framework router typically intercepts the navigate event.  To workaround this, use the waitFor... functions and pass in a selector or state variable to be evaluated. For example, in a Vue application you may want pass window._VuePageMounted and set this to false in the beforeDestroy and true in the mounted lifecycle hook of your page components. Then put this in a step file:

```

...
waitForEvaluate?window._VuePageMounted
...

```
