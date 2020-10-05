import Phaser from 'phaser';
import { Anims } from './anims';

/**
 * Parent class for all playable scenes
 */
export class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'Area51'
		});

		this.cursors = null; // User controls
		this.player = null;

		this.spawnPoint = {
			x:450,
			y:1200
		};

		// The Anims class is tightly coupled to this GameScene class and
		// is used to break the animation setup code into its own file.
		this.animsManager = new Anims(this);
	}
	
	init(data){ }

	preload() {
		this.load.json('scriptdata', 'assets/data/script.json');
		this.load.image('tiles', 'assets/tilemaps/Area-51.png');
		this.load.tilemapTiledJSON('map', 'assets/tilemaps/area-51.json');
		this.animsManager.preload();
	}

	create(settings) {

		// Set up simple keyboard controls
		this.cursors = this.input.keyboard.createCursorKeys();

		// Set up the player character
		window.player = this.player = this.add.rpgcharacter({
			x: this.spawnPoint.x,
			y: this.spawnPoint.y,
			name: 'zeta',
			image: 'zeta',
			speed: 225
		});

		// Load map json from Tiled
		const map = this.make.tilemap({ key: 'map' });
		// settings.tiledKey is the name of the tileset in Tiled
		const tileset = map.addTilesetImage('Area-51', 'tiles');
		// layer key is the layer name set in Tiled
		const backgroundLayer = map.createStaticLayer('Background', tileset, 0, 0);
		const interactiveLayer = map.createStaticLayer('Interactive', tileset, 0, 0);
		const overheadLayer = map.createStaticLayer('Overhead', tileset, 0, 0);

		// Identify the collision property set in the interactive layer in Tiled
		interactiveLayer.setCollisionByProperty({ collide: true });
		// Set up collision detection between the player and interactive layer
		this.physics.add.collider(this.player, interactiveLayer);

		// Extract objects from the object layer
		const objectLayer = map.getObjectLayer('Script');
		// Convert object layer objects to Phaser game objects
		if(objectLayer && objectLayer.objects){
			objectLayer.objects.forEach(
				(object) => {
					let tmp = this.add.rectangle((object.x+(object.width/2)), (object.y+(object.height/2)), object.width, object.height);
					tmp.properties = object.properties.reduce(
						(obj, item) => Object.assign(obj, { [item.name]: item.value }), {}
					);
					this.physics.world.enable(tmp, 1);
					this.physics.add.collider(this.player, tmp, this.HitScript, null, this);
				}
			);
		}

		// Place the player above the tile layers
		this.player.setDepth(10);
		// Place the overhead layer above everything else
		overheadLayer.setDepth(20);

		// Set up the main (only?) camera
		const camera = this.cameras.main;
		camera.startFollow(this.player);
		
		// Use the anims manager to set up local sprite animations
		this.animsManager.create();

		// Get script data preloaded from script.json
		this.script = this.cache.json.get('scriptdata');

	}

	update(time, delta) {

		// Close the dialog on spacebar press
		if( this.gzDialog.visible ){
			if( this.cursors.space.isDown ){
				this.gzDialog.display(false);
			}
			return false;
		}
		// Horizontal movement
		if (this.cursors.left.isDown)
			this.player.SetInstruction({action: 'walk', option: 'left'});
		else if (this.cursors.right.isDown)
			this.player.SetInstruction({action: 'walk', option: 'right'});

		// Vertical movement
		if (this.cursors.up.isDown)
			this.player.SetInstruction({action: 'walk', option: 'back'});
		else if (this.cursors.down.isDown)
			this.player.SetInstruction({action: 'walk', option: 'front'});

		this.player.update();

		return true;
	}

	/**  
	 * Handle collisions with the script layer. Tiles which have a dialog response are given
	 * a 'name' property with a value that corresponds to a key in the script object found
	 * in script.js
	 */
	HitScript(player, target){
		if(target.properties.name && !this.gzDialog.visible){
			player.anims.stopOnRepeat();
			this.gzDialog.setText(this.script[player.name][target.properties.name]);
		}
	}

}
