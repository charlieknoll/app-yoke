# AppYoke

App for automating the chrome dev tools experience, great for developing SPA, PWA and electron apps. Uses puppeteer under the covers.

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

- Configure the DEBUG_ORIGIN in the .env file (e.g. http://localhost:8080)
- Configure the target PROJECT_PATH in the .env file (e.g. /dev/todo-app) 
```
node app.js
```

### Configuring your target project

- Copy the app-yoke/example-project/app-yoke folder to your target project
- Start up your local web server or debug in vs code (e.g. your app running on localhost:8080)
- Start brave, edge or chrome with remote-debugging flag set (see chrome.bat)
- Navigate to your debugging url (e.g. localhost:8080) in your debugging browser

> **IMPORTANT:** Be sure to close all instances of your testing browser before starting in debugger mode.

Assuming you started the AppYoke server at port 3000, you can now invoke actions and step files:

```
curl localhost:3000/clearSiteData
curl localhost:3000/step-file?hello.txt 
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

```evaluateValue(js,value)```: Pass a javascript string which evaluates to a value and checks to see if it matches value

```network(enable)```: Enables/disables netork

```bash```: Exec a command in a bash prompt, good for running npm scripts or deployment commands

```clickText(twopartselector)```: Pass a selector in the form selector > innerText. E.g. to click the button including label "Reload" pass "button > Reload". The element.innerText.includes(innerText) is used to match partial strings.

### Enhanced Actions

```click(selector)```: Uses page.evaluate => document.querySelector(selector).click() instead of page.click()

```press(selector,keys,options)```:  Pass a comma delimited list and keyboard.down/up will be sent for the modifier keys and keyboard.press will be used for non modifier keys. Useful for highlighting an existing value before typing text into and input. E.g. "Control,a" would highlight existing text sending keyboard.down("Control"), keyboard.press("a") and keyboard.up("Control"). Subsequent "type" call would overwrite the text in the field. Supported modifier key strings: Control,Shift,Alt.

```type(selector,text,options)```: Same as page.type except defaults typing speed to 50ms instead of 100ms

```ktype(text,options)```: Same as keyboard.type except defaults typing speed to 50ms instead of 100ms

```waitForFunction(pageFunction, options, args)```: Uses the WAIT_FOR env variable as the function if no pageFunction is specified

### Combination Actions

```waitForClick(selector,clickOptions)```: A combination of the additional action waitForSelector and page.click. Helpful when navigating between pages

```waitForPress(selector,text)```: A combination of the additional action waitForSelector and the enhanced action press. Helpful when navigating between pages.

```waitForEvaluateValue(js,value)```: Waits for the passed javascript string to evaluate to value 
### Console Related Actions

```console?enabled(true,false)```: Enables/disables AppYoke messages to the target browser

```info?message```: Logs an info message

```error?message```: Logs an error message

### Conditional Actions

```clickIf(selector, js,clickOptions)```: Only click if the js evaluates to true

```pressIf(js,keys)```: Only press the comma delimited keys if the js evaluates to true


## AppYoke Project Folder Format

See the example-project/app-yoke for an example

## Step File Format

Each line in a step file is considered an Action

Actions can be called in 2 ways:
- action?singleParam (e.g. sleep?500)
- action?params=JSON array (e.g. sleep?params="["sleep": "500"]")

Comment actions by placing a semi-colon as the first character in the step line.

Lines that start with "exit" will terminate the step file.

Values wrapped with @@@ will be replaced with env variable. The text '@@@API_KEY@@@' below will be replaced by the API_KEY variable in the .env residing in the target project app-yoke/.env file

```
goto?params=["http://localhost:8081?apikey=@@@API_KEY@@@", {"waitUntil": "load"}]
```

## Examples

Are you tired of clearing site data, reloading page, reloading again to populate data, logging in, disabling/enabling network and repeating over and over again as you test your application?  If so, set up a steps file and hook it up with a hot key to get instant automation of the steps.

```text
;This script fully reloads a pwa, auth using api key, 
;hydrates cache and resets site settings
network?true
reload
console?true
clearSiteData
goto?params=["http://localhost:8081?apikey=@@@API_KEY@@@", {"waitUntil": "load"}]
waitForClick?div.q-banner[name="settings-banner"] button[tabindex="0"]
waitForSelector?#albumTitle
sleep?400
press?params=["#albumTitle","Control,a"]
type?params=["#albumTitle","PhotoAhC"]
clickText?button > Reload Album
sleep?2000
clickText?a > Home
sleep?1000
network?false
reload

```

## Automation

There are number of ways to further speed up your development cycles through automation:

- enter a curl command in the terminal to call the stepfile curl localhost:3000/stepfile?mystepfile.txt
- Use postman to set up a bunch of requests to stepfiles or directly to actions
- Use autohotkey (Windows only) to have system wide hotkeys linked to stepfile api calls (see the example in example-project/app-yoke/autohotkey)

## Tips

It can be helpful to create a separate brave/chrome profile for debugging with only the necessary extensions installed to support debugging.  Some extensions e.g. adblockers, password managers, etc can pollute the DOM and make it difficult to inspect elements cleanly.  See the scripts in the ```./bin``` folder for examples.

When developing SPA's the document.ready will always evaluate to true because the SPA framework router typically intercepts the navigate event.  To workaround this, use the waitFor... functions and pass in a selector or state variable to be evaluated. For example, in a Vue application you may want pass window._VuePageMounted and set this to false in the beforeDestroy and true in the mounted lifecycle hook of your page components. Then put this in a step file:

```text

...
waitForEvaluate?window._VuePageMounted
...

```

Setting ```network?true``` at the top of the script file will ensure the network is always on when script is started.

Add sleep after navigation clicks to ensure the app has completely loaded.

If you want to block execution of a step file, add an action that show an alert in the browser:

```text
...
;step file will pause until the alert is clicked in the browser:
evaluate?alert('test')
...
```

Evaluate some javascript to add a shortcut property to the window global variable. E.g in Quasar apps with a $store on the Vue instance you could run the following code. This would allow youto access window.$store on future ```evaluate```, ```clickIf``` or ```pressIf``` actions:

```text
evaluate?window.vmEl = document.getElementById('q-app');window.$store = window.vmEl.__vue__.$store;
;Then later in the script press the space bar if not signed in:
pressIf?params=["!window.$store.isSignedIn","Space"]
```
