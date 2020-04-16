import { GameScene } from "../GameScene";
import { RpgCharacter } from '../RpgCharacter';

export class Area51 extends GameScene {
	constructor(){
		super('Area51');
	}

	init(data){
		this.spawnPoint = {
			x:450,
			y:1200
		}
		this.securityPoint = {
			x:780,
			y:170
		}
		if(data.hasOwnProperty('origin')){
			if(data.origin === 'Lab1') this.spawnPoint = {
				x:688,
				y:236
			}
		}
	}

	preload(){
		this.load.image("tiles", "assets/images/Area-51.png");
		this.load.tilemapTiledJSON("map", "assets/tilemaps/area-51.json");
		this.load.image("saucer", "assets/images/saucer.png");

		super.preload();
	}

	create(){
		super.create();

		// this.sentry = new RpgCharacter({
		// 	scene: this,
		// 	x: this.spawnPoint.x,
		// 	y: this.spawnPoint.y-100,
		// 	image: 'security',
		// 	path: [
		// 		{x: 570, y: 170},	// top left
		// 		{x: 570, y: 250},	// bottom left
		// 		{x: 780, y: 250},	// bottom right
		// 		{x: 780, y: 170}	// top right
		// 	],
		// 	speed: 225
		// });

		// this.physics.add.collider(this.player, this.sentry, function(player, target){
		// 	if(this.player.isHit <= 0){
		// 		this.player.tint = 0xff0000;
		// 		this.player.isHit = 10;
		// 		this.player.body.setVelocity((player.x-target.x)*10,(player.y-target.y)*10);
		// 	}
		// 	this.sentry.body.setVelocity(0);
		// }.bind(this));
	}

	update(){
		super.update();

		//this.sentry.update();
	}
}