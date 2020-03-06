# ![GreenZeta Logo](https://www.greenzeta.com/android-icon-72x72.png) gz-webpack-boilerplate
## Webpack 4 Boilerplate

[![Dependency Status](https://david-dm.org/mwilber/gz-webpack-boilerplate.svg)](https://david-dm.org/mwilber/gz-webpack-boilerplate)
[![devDependency Status](https://david-dm.org/mwilber/gz-webpack-boilerplate/dev-status.svg)](https://david-dm.org/mwilber/gz-webpack-boilerplate)

Lightweight Webpack 4 boilerplate with Babel, SASS and no production dependencies. Includes: 
* PWA support 
    * Web manifest
    * Service worker
    * Front-loading app shell css file
* OpenGraph meta tags for social media sharing

## Table of contents
- [Requirements](#requirements)
- [Project Files](#project-files)
- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)
- [Configuring OpenGraph Metadata](#configuring-opengraph-metadata)
- [Progressive Web App (PWA) Support](#progressive-web-app-pwa-support)
- [Webpack](#webpack)

## Requirements
All you need is <b>node.js</b> pre-installed and you’re good to go.

## Project Files
```
.
├── app-shell.css                       # Vanilla css to display before JS bundle loads
├── assets                              # Project media files
│   ├── icons                           # Icons used for PWA installation
│   │   ├── icon-#x#.png
│   └── images                          # Project images directory
│       └── logo.svg            
├── index.ejs                           # Project index.html file template
├── manifest.json                       # Web manifest file used for PWA installation
├── package.json                        # Packaging information and node scripts (see below)
├── service-worker.js                   # A boilerplate service worker
├── src
│   ├── main.js                         # Add your JavaScript here
│   └── serviceWorkerRegistration.js    # Optional service worker registration script
├── styles
│   ├── _normalize.scss                 # CSS normalizer
│   └── main.scss                       # Add your SASS here
├── webpack.config.build.js             # Production webpack configuration
├── webpack.config.common.js            # Base webpack configuration
└── webpack.config.dev.js               # Development webpack configuration
```

## Setup
From within your project directory:
```sh
$ curl -L -o master.zip https://github.com/mwilber/gz-webpack-boilerplate/archive/master.zip && unzip master.zip && rm master.zip && mv -n ./gz-webpack-boilerplate-master/{.,}* ./ && rm -r ./gz-webpack-boilerplate-master
```
Install dev dependencies
```sh
$ npm install
```

## Development
Run the local webpack-dev-server with livereload and autocompile on [http://localhost:8699/](http://localhost:8699/)
```sh
$ npm start
```
## Deployment
Build the current application
```sh
$ npm run build
```

## Configuring OpenGraph Metadata
Control social network sharing presentation with custom metadata added to your index.html file. Metadata is configured in the `webpack.config.common.js` file. Locate the `htmlMetadata` object and update with your project information:
```js
const htmlMetadata = {
    domain: 'greenzeta.com',
    title: 'GreenZeta Webpack Boilerplate',
    author: 'Matthew Wilber',
    description: 'Webpack boilerplate using babel & sass.',
    themecolor: '#7bb951',
    twittername: 'greenzeta',
    facebookid: '631337813',
};
```

## Progressive Web App (PWA) Support
Progressive Web Apps allow visitors to install your website and use it as a native application. This project satisfies the first two of the three minimum requirements for PWA installation:
1. Web Manifest
2. Service Worker
3. SSL Hosting

For more information on PWAs and their development, check out the [10 Minute PWA demo](https://www.greenzeta.com/the-10-minute-progressive-web-app/) and [The Progressive Web App Philosophy](https://www.greenzeta.com/tessera/the-pwa-philosophy/) from [GreenZeta](http://greenzeta.com)

## Webpack
If you're not familiar with webpack, the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) will serve the static files in your build folder and watch your source files for changes.
When changes are made the bundle will be recompiled. This modified bundle is served from memory at the relative path specified in publicPath.
