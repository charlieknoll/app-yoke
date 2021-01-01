# chrome-dev-tools-controller

> **IMPORTANT:** Be sure to close all instances of brave or chrome before starting in debugger mode.

## Requirements

- node.js
- <a href="https://www.autohotkey.com/" target="_blank">autohotkey</a> (optional)

## Getting Started

- Start up your local dev enivironment (e.g. your app running on localhost:8080)
- Start brave or chrome with remote-debugging flag set (see chrome.bat)
- Navigate to your debugging url (e.g. localhost:8080)
- Clone this repo, then run:

```
npm install
cp .env.example .env
```

- Configure the 

## Examples

Are you tired of clearing site data, clearing notification settings, reloading page, reloading again to populate data, logging in, disabling/enabling network and repeating over and over again as you test your application?  If so, set up a steps file and hook it up with a hot key to get instant automation of the steps.

## Tips

It can be helpful to create a separate brave/chrome profile for debugging with only the necessary extensions installed to support debugging.  Some extensions e.g. adblockers, password managers, etc can pollute the DOM and make it difficult to inspect elements cleanly.  See the scripts in the ```./bin``` folder for examples.

When developing SPA's the document.ready will always evaluate to true because the SPA framework router typically intercepts the navigate event.  To workaround this, use the gotoWaitFor function and pass in a state variable to be evaluated. For example, in a Vue application you may want pass window._VuePageMounted and set this to false in the beforeDestroy and true in the mounted lifecycle hook of your page components.