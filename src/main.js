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
import { EndScene } from './scenes/EndScene';
import { IntroScene } from './scenes/IntroScene';
import { GzRpgCharacterPlugin } from './plugins/GzRpgCharacter';
import { GzDialog } from './plugins/GzDialog';

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
			debug: false
		}
	},
	plugins: {
        global: [
            { key: 'GzRpgCharacterPlugin', plugin: GzRpgCharacterPlugin, start: true }
		],
		scene: [
            { key: 'gzDialog', plugin: GzDialog, mapping: 'gzDialog' }
        ]
    },
	scene: [
		IntroScene,
		Area51,
		Lab1,
		Lab2,
		EndScene
	]
};

const phaserGame = new Phaser.Game(gameConfig);

phaserGame.global = {
	playerHp: -1,
}