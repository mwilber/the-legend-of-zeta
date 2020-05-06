import Phaser from 'phaser';
import { GzDialog } from './plugins/GzDialog';
import { RpgCharacter } from './RpgCharacter';
import { Anims } from './anims';

/**
 * Parent class for all playable scenes
 */
export class GameScene extends Phaser.Scene {
	constructor(sceneName) {
		super({
			key: sceneName
		});

		this.controls = null; // User controls
		this.cursors = null;
		this.player = null;

		this.spawnPoint = null;

		this.portals = {};

		// The Anims class is tightly coupled to this GameScene class and
		// is used to break the animation setup code into its own file.
		this.animsManager = new Anims(this);
	}
	
	init(data){ }

	preload() {
		this.load.scenePlugin('gzDialog', GzDialog);
		this.load.json('scriptdata', 'assets/data/script.json');
		this.load.image('heart', 'assets/images/heart_full.png');
		this.animsManager.preload();
	}

	create(settings) {

		// Set up simple keyboard controls
		this.cursors = this.input.keyboard.createCursorKeys();

		// Set up the player character
		window.player = this.player = new RpgCharacter({
			scene: this,
			x: this.spawnPoint.x,
			y: this.spawnPoint.y,
			name: 'zeta',
			image: 'zeta',
			speed: 225
		});

		// Restore player health from global
		if(this.game.global.playerHp !== -1) this.player.hp = this.game.global.playerHp;
		
		// Load map json from Tiled
		const map = this.make.tilemap({ key: settings.mapKey });
		// settings.tiledKey is the name of the tileset in Tiled
		const tileset = map.addTilesetImage(settings.tiledKey, settings.tileKey);
		// layer key is the layer name set in Tiled
		const backgroundLayer = map.createStaticLayer('Background', tileset, 0, 0);
		const interactiveLayer = map.createStaticLayer('Interactive', tileset, 0, 0);
		const scriptLayer = map.createStaticLayer('Script', tileset, 0, 0);
		let overheadLayer = map.createStaticLayer('Overhead', tileset, 0, 0);

		// Identify the collision property set in the interactive layer in Tiled
		interactiveLayer.setCollisionByProperty({ collide: true });
		// Set up collision detection between the player and interactive layer
		this.physics.add.collider(this.player, interactiveLayer, this.HitInteractiveLayer.bind(this));

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
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
		// Use the anims manager to set up local sprite animations
		this.animsManager.create();

		// Set up the dialog plugin
		this.gzDialog.init();

		// Get script data preloaded from script.json
		this.script = this.cache.json.get('scriptdata');

		// Add a container of hearts to show the player's health
		this.hearts = this.add.container(700, 32).setScrollFactor(0).setDepth(1000);
		for(let idx=0; idx<this.player.hp; idx++ )
			this.hearts.add(this.add.image((idx*20), 0, 'heart'));
	}

	update(time, delta) {

		// Update the global player health
		this.game.global.playerHp = this.player.hp;

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

		// End game
		if(this.player.hp <= 0 && this.player.isHit <= 0){
			this.player.destroy();
			console.log('you dead');
			this.scene.start('EndScene');
		}else{
			if(this.hearts.list.length > this.player.hp){
				this.hearts.removeAt(this.hearts.list.length-1, true);
			}
		}

		return true;
	}

	/** Handle collisions with the interactive layer. Tiles with the property `portal` are
	 * used to transition into new scenes.
	 */
	HitInteractiveLayer(player, target){
		if(target.properties && target.properties.portal && this.portals[target.properties.portal]) 
			this.scene.start(this.portals[target.properties.portal], {origin:this.scene.key});
	}

	/**  
	 * Handle collisions with the script layer. Tiles which have a dialog response are given
	 * a 'name' property with a value that corresponds to a key in the script object found
	 * in script.js
	 */
	HitScript(player, target){
		if(target.properties.name && !this.gzDialog.visible){
			player.anims.stopOnRepeat();
			this.gzDialog.setText(this.script[player.name][target.properties.name], true);
		}
	}
	
}
