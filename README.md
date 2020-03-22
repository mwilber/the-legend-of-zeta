# ![The Legend of Zeta Logo](https://www.greenzeta.com/android-icon-72x72.png) the-legend-of-zeta
## Source code for the presentation: Tile maps and world building with the Phaser framework.

The Legend of Zeta is a [Phaser3](http://phaser.io) clone of the classic nintendo game The legend of Zelda. Written in ES6 syntax javascript and using a webpack workflow. 

Built with the [gz-webpack-boilerplate](https://github.com/mwilber/gz-webpack-boilerplate)!

## Requirements
All you need is <b>node.js</b> pre-installed and you’re good to go.

## Setup
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

## Webpack
If you're not familiar with webpack, the [webpack-dev-server](https://webpack.js.org/configuration/dev-server/) will serve the static files in your build folder and watch your source files for changes.
When changes are made the bundle will be recompiled. This modified bundle is served from memory at the relative path specified in publicPath.
