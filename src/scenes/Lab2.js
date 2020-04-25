import { GameScene } from "../GameScene";
import { RpgCharacter } from '../RpgCharacter';

/**
 * Lab 2 Level scene
 */
export class Lab2 extends GameScene {
	constructor(){
        super('Lab2');
        
        this.portals.ascend = 'Lab1';
	}

	init(data){
		this.spawnPoint = {
            x:400,
            y:600
        };
	}

	preload(){
		this.load.image("seckrit-lab-tiles", "assets/images/scifitiles-sheet.png");
        this.load.tilemapTiledJSON("lab-2", "assets/tilemaps/lab-2.json");

		super.preload();
	}

	create(){
		super.create({
			tileKey: 'seckrit-lab-tiles',
			mapKey: 'lab-2',
			tiledKey: 'seckrit-lab'
		});

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