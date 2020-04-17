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
		//const debugGraphics = this.add.graphics().setAlpha(0.75);
		// worldLayer.renderDebug(debugGraphics, {
		//     tileColor: null, // Color of non-colliding tiles
		//     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
		//     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
		// });


		this.player = new RpgCharacter({
			scene: this,
			x: this.spawnPoint.x,
			y: this.spawnPoint.y,
			name: 'zeta',
			image: 'zeta',
			speed: 225
		});

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


	HitInteractiveLayer(player, target){
		if(target.properties && target.properties.portal && this.portals[target.properties.portal]) 
			this.scene.start(this.portals[target.properties.portal], {origin:this.scene.key});
	}

	HitScript(player, target){
		if(target.properties.name && !this.gzDialog.visible)
			this.gzDialog.setText(Script[player.name][target.properties.name], true);
	}
	
}
