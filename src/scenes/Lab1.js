import { GameScene } from "../GameScene";
import { RpgCharacter } from '../RpgCharacter';

export class Lab1 extends GameScene {
	constructor(){
        super('Lab1');
        
        this.portals.ascend = 'Area51';
        this.portals.descend = 'Lab2';
	}

	init(data){
		this.spawnPoint = {
            x:400,
            y:700
        };
        this.securityPoint = {
			x:220,
			y:310
		};
        if(data.hasOwnProperty('origin')){
            if(data.origin === 'Lab2') this.spawnPoint = {
                x:400,
                y:75
            }
        }
	}

	preload(){
		this.load.image('seckrit-lab-tiles', 'assets/images/scifitiles-sheet.png');
        this.load.tilemapTiledJSON('lab-1', 'assets/tilemaps/lab-1.json');

		super.preload();
	}

	create(){
        super.create({
			tileKey: 'seckrit-lab-tiles',
			mapKey: 'lab-1',
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