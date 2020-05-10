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

		// Place the player above the tile layers
		this.player.setDepth(10);
		// Place the overhead layer above everything else
		overheadLayer.setDepth(20);

		// Set up the main (only?) camera
		const camera = this.cameras.main;
		camera.startFollow(this.player);
		
		// Use the anims manager to set up local sprite animations
		this.animsManager.create();

		this.gzDialog.setText('This is a test. Hello World!');

	}

	update(time, delta) {

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

}
