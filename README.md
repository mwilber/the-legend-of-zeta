# ![The Legend of Zeta Logo](https://www.greenzeta.com/wp-content/uploads/2020/06/TheLegendOfZeta-150x150.png) the-legend-of-zeta
## Source code for the presentation: Tile maps and world building with the Phaser framework.

The Legend of Zeta is a [Phaser3](http://phaser.io) clone of the original nes game The Legend of Zelda.

Built with the [gz-webpack-boilerplate](https://github.com/mwilber/gz-webpack-boilerplate)!

![The Legend of Zeta ScreenShot](https://www.greenzeta.com/wp-content/uploads/2020/04/22-speed-run.png)

## Table of contents
- [The Presentation](#presentation)
- [Setup](#setup)
- [Development](#development)
- [Deployment](#deployment)
- [Webpack](#webpack)

## Presentation

Slides from the presentation are available on [slides.com](https://slides.com/greenzeta/phaser-2#/). To follow development of the game as presented, look at the sequential numbered branches named beginning with [step-01](https://github.com/mwilber/the-legend-of-zeta/tree/step-01). 

![Presentation ScreenShot](https://www.greenzeta.com/wp-content/uploads/2020/05/Screen-Shot-2020-05-07-at-9.37.19-PM.png)

## Setup
Clone this repo and enter the project directory:
```sh
$ git clone https://github.com/mwilber/the-legend-of-zeta
$ cd the-legend-of-zeta
```
Install dependencies:
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
