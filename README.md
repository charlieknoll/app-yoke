# AppYoke

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

## Tips

It can be helpful to create a separate brave/chrome profile for debugging with only the necessary extensions installed to support debugging.  Some extensions e.g. adblockers, password managers, etc can pollute the DOM and make it difficult to inspect elements cleanly.  See the scripts in the ```./bin``` folder for examples.
