/**
 * Application entry point
 */

/**
 * Import PWA helper files
 * 
 * These file are optional. app-shell.css will not be packed into the js bundle and is linked 
 * separately in index.html. Use for initial styling to be displayed as JavaScripts load. serviceWorkerRegistration 
 * contains registration code for service-worker.js For more information on service workers and Progressive Web Apps 
 * check out the GreenZeta 10 minute PWA example at https://github.com/mwilber/gz-10-minute-pwa
 */ 
import '../app-shell.css';
//import './serviceWorkerRegistration';

// Load application styles
import '../styles/main.scss';

import 'phaser';
import { Area51 } from './scenes/Area51';
import { Lab1 } from './scenes/Lab1';
import { Lab2 } from './scenes/Lab2';
//import { GzDialog } from './plugins/gzDialog';

const gameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'phaser-game',
	dom: {
		createContainer: true
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true
		}
	},
	scene: [
		Area51,
		Lab1,
		Lab2,
	]
};

new Phaser.Game(gameConfig);

// // Register this plugin with the PluginManager
// GzDialog.register = function (PluginManager) {
// 	GzDialog.register('GzDialog', GzDialog, 'dialogModal');
// };