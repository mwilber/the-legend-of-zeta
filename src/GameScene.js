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

		// Set up the main (only?) camera
		const camera = this.cameras.main;
		camera.startFollow(this.player);
		
		// Use the anims manager to set up local sprite animations
		this.animsManager.create();

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
