import Phaser from 'phaser';
import { GzDialog } from './plugins/GzDialog';
import { Script } from './script';
import { RpgCharacter } from './RpgCharacter';
import { Anims } from './anims';

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

		this.animsManager = new Anims(this);
	}
	
	init(data){
		
	}

	preload() {
		this.load.scenePlugin('gzDialog', GzDialog);
		this.animsManager.preload();
	}

	create(settings) {
		const map = this.make.tilemap({ key: settings.mapKey });

		// Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
		// Phaser's cache (i.e. the name you used in preload)
		const tileset = map.addTilesetImage(settings.tiledKey, settings.tileKey);

		// Parameters: layer name (or index) from Tiled, tileset, x, y
		const belowLayer = map.createStaticLayer("Background", tileset, 0, 0);
		const worldLayer = map.createStaticLayer("Interactive", tileset, 0, 0);
		const scriptLayer = map.createStaticLayer("Script", tileset, 0, 0);

		const objects = map.getObjectLayer('Script'); //find the object layer in the tilemap named 'objects'

		worldLayer.setCollisionByProperty({ collide: true });
		const debugGraphics = this.add.graphics().setAlpha(0.75);
		// worldLayer.renderDebug(debugGraphics, {
		//     tileColor: null, // Color of non-colliding tiles
		//     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		//     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		// });

		this.player = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, "atlas", "misa-front").setSize(30, 40).setOffset(0, 24);
		this.player.name = 'zeta';
		this.player.isHit = 0;
		this.player.direction = 'front';

		this.physics.add.collider(this.player, worldLayer, this.HitInteractiveLayer.bind(this));

		if(objects && objects.objects){
			objects.objects.forEach(
				(object) => {
					let tmp = this.add.rectangle((object.x+(object.width/2)), (object.y+(object.height/2)), object.width, object.height);
					tmp.properties = object.properties.reduce(
						(obj, item) => Object.assign(obj, { [item.name]: item.value }), {}
					);
					this.physics.world.enable(tmp, 1);
					this.physics.add.collider(this.player, tmp, this.HitScript, null, this);

					this.add.text((tmp.x), (tmp.y-tmp.height), 'script', { color: '#ffffff', textAlagn: 'center' });
				}
			);
		}

		let aboveLayer = map.createStaticLayer("Rooftops", tileset, 0, 0);
		if(!aboveLayer) aboveLayer = map.createStaticLayer("Overhead", tileset, 0, 0);

		// Phaser supports multiple cameras, but you can access the default camera like this:
		const camera = this.cameras.main;
		camera.startFollow(this.player);
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		// Set up the arrows to control the camera
		this.cursors = this.input.keyboard.createCursorKeys();
		// this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
		//     camera: camera,
		//     left: cursors.left,
		//     right: cursors.right,
		//     up: cursors.up,
		//     down: cursors.down,
		//     speed: 0.5
		// });

		// Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
		camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
		this.animsManager.create();

		this.gzDialog.init();
	}

	update(time, delta) {
		const speed = 225;
		const prevVelocity = this.player.body.velocity.clone();
		// Apply the controls to the camera each update tick of the game
		//this.controls.update(delta);

		// Handle the player hit
		if(this.player.isHit > 0){
			this.player.isHit--;

		}else{
			this.player.tint = 0xffffff;
			this.player.body.setVelocity(0);
		}

		if( this.gzDialog.visible ){
			if( this.cursors.space.isDown ){
				this.gzDialog.display(false);
			}
		}else if(this.player.isHit <= 0){

			// Horizontal movement
			if (this.cursors.left.isDown) {
				this.player.body.setVelocityX(-speed);
				this.player.direction = 'left';
			} else if (this.cursors.right.isDown) {
				this.player.body.setVelocityX(speed);
				this.player.direction = 'right';
			}

			// Vertical movement
			if (this.cursors.up.isDown) {
				this.player.body.setVelocityY(-speed);
				this.player.direction = 'back';
			} else if (this.cursors.down.isDown) {
				this.player.body.setVelocityY(speed);
				this.player.direction = 'front';
			}
		}

		// Normalize and scale the velocity so that player can't move faster along a diagonal
		this.player.body.velocity.normalize().scale(speed);

		// Update the animation last and give left/right animations precedence over up/down animations
		if (this.cursors.left.isDown) {
			this.player.anims.play("misa-left-walk", true);
		} else if (this.cursors.right.isDown) {
			this.player.anims.play("misa-right-walk", true);
		} else if (this.cursors.up.isDown) {
			this.player.anims.play("misa-back-walk", true);
		} else if (this.cursors.down.isDown) {
			this.player.anims.play("misa-front-walk", true);
		} else {
			this.player.anims.stop();

			// If we were moving, pick and idle frame to use
			if (prevVelocity.x < 0) this.player.setTexture("atlas", "misa-left");
			else if (prevVelocity.x > 0) this.player.setTexture("atlas", "misa-right");
			else if (prevVelocity.y < 0) this.player.setTexture("atlas", "misa-back");
			else if (prevVelocity.y > 0) this.player.setTexture("atlas", "misa-front");
		}

	}


	HitInteractiveLayer(player, target){
		if(target.properties && target.properties.portal && this.portals[target.properties.portal]) 
			this.scene.start(this.portals[target.properties.portal], {origin:this.scene.key});
	}

	HitScript(player, target){
		if(target.properties.name && !this.gzDialog.visible)
			this.gzDialog.setText(Script[player.name][target.properties.name], true);
	}

	_degrees_to_radians(degrees)
	{
		var pi = Math.PI;
		return degrees * (pi/180);
	}
	
}
