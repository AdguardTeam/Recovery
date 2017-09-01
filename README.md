# Anti Adblock [![Build Status](https://travis-ci.org/4-life/AntiAdblock.svg?branch=master)](https://travis-ci.org/4-life/AntiAdblock)

Anti Adblock userscript and extension

## Development build

Built automatically userscript file on every new commit [here](http://4-life.github.io/AntiAdblock/userscript/userscript.user.js)

Userscript [options page](http://4-life.github.io/AntiAdblock/options/)

Unit test page for dev build [here](https://4-life.github.io/AntiAdblock/test/)

## How to build

For build userscript:

    $ npm run usr-build

For build options page:

    $ npm run opt-build

Download localization files (requires download file settings `oneskeyapp.json`):

    $ npm run locales

Upload localization file to oneskeyapp (_locales/en.json):

    $ npm run upd-en
