import { GameScene } from '../GameScene';

/**
 * Area 51 Level scene
 */
export class Area51 extends GameScene {
	constructor(){
		super('Area51');

		this.portals.lab = 'Lab1';
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
		this.load.image('tiles', 'assets/tilemaps/Area-51.png');
		this.load.tilemapTiledJSON('map', 'assets/tilemaps/area-51.json');
		this.load.image('saucer', 'assets/images/saucer.png');

		super.preload();
	}

	create(){
		super.create({
			tileKey: 'tiles',
			mapKey: 'map',
			tiledKey: 'Area-51'
		});

		this.sentry = this.add.rpgcharacter({
			x: this.securityPoint.x,
			y: this.securityPoint.y,
			image: 'security',
			path: [
				{x: 570, y: 170},	// top left
				{x: 570, y: 250},	// bottom left
				{x: 780, y: 250},	// bottom right
				{x: 780, y: 170}	// top right
			],
			speed: 112
		});

		this.physics.add.collider(this.sentry, this.player, this.player.DoHit);
	}

	update(){
		if(super.update()){
			this.sentry.update();
		}else{
			this.sentry.DoHalt();
		}
	}
}