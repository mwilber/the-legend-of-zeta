import Phaser from 'phaser';
import { GzDialog } from '../plugins/GzDialog';
import { Script } from '../script';

export class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene'
		});

		this.controls = null; // User controls
		this.cursors = null;
		this.player = null;

		this.spawnPoint = null;
	}
	
	init(data){
		this.spawnPoint = {
			x:450,
			y:1200
		}
		if(data.hasOwnProperty('origin')){
			if(data.origin === 'Lab1') this.spawnPoint = {
				x:688,
				y:236
			}
		}
	}

	preload() {
		this.load.scenePlugin('gzDialog', GzDialog);

		this.load.image("tiles", "assets/images/Area-51.png");
		this.load.tilemapTiledJSON("map", "assets/tilemaps/area-51.json");

		this.load.atlas("atlas", "assets/images/zeta_walk.png", "assets/sprites/atlas.json");
		this.load.image("saucer", "assets/images/saucer.png");

		this.load.spritesheet('security', 
            'assets/sprites/security.png',
            { frameWidth: 36, frameHeight: 42 }
		);
		
		this.load.spritesheet('blue-lightning', 
            'assets/sprites/blue-lightning.png',
            { frameWidth: 16, frameHeight: 32 }
        );
	}

	create() {
		const map = this.make.tilemap({ key: "map" });

		// Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
		// Phaser's cache (i.e. the name you used in preload)
		const tileset = map.addTilesetImage("Area-51", "tiles");

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

		
		this.security = this.physics.add.sprite(this.spawnPoint.x-50, this.spawnPoint.y-100, 'security');
		this.physics.add.collider(this.player, worldLayer, this.HitInteractiveLayer.bind(this));

		this.physics.add.collider(this.player, this.security, function(player, target){
			let reaction = [player.x-target.x,player.y-target.y];
            //console.log("GameScene -> create -> reaction", reaction)

			//if(!this.gzDialog.visible)
			//	this.gzDialog.setText("Dude! Lay off the coffee.", true);
			if(this.player.isHit <= 0){
				this.player.tint = 0xff0000;
				this.player.isHit = 10;
				this.player.body.setVelocity((player.x-target.x)*10,(player.y-target.y)*10);
			}
		}.bind(this));

		this.lightning = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'blue-lightning');
		this.physics.add.overlap(this.security, this.lightning, function(player, target){
        //console.log("GameScene -> create -> player, target", player, target)
			//if(this.security.isHit <= 0){
				this.security.tint = 0xff0000;
				this.security.isHit = 10;
				this.security.body.setVelocity((player.x-target.x)*10,(player.y-target.y)*10);
			//}
		}.bind(this));
		this.lightning.setActive(false);
		this.lightning.setVisible(false);

		objects.objects.forEach(
			(object) => {
				let tmp = this.add.rectangle((object.x+(object.width/2)), (object.y+(object.height/2)), object.width, object.height);
				tmp.properties = object.properties.reduce(
					(obj, item) => Object.assign(obj, { [item.name]: item.value }), {}
				);
				this.physics.world.enable(tmp, 1);
				this.physics.add.collider(this.player, tmp, this.HitScript, null, this);
				//debugger;
				//this.objects.push(tmp);

				// Add pad label
				//if(tmp.properties.padnum !== 0){
					this.add.text((tmp.x), (tmp.y-tmp.height), 'script', { color: '#ffffff', textAlagn: 'center' });
				//}
			}
		);

		const aboveLayer = map.createStaticLayer("Rooftops", tileset, 0, 0);

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

		const anims = this.anims;
		anims.create({
			key: "misa-left-walk",
			frames: anims.generateFrameNames("atlas", { prefix: "misa-left-walk.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: "misa-right-walk",
			frames: anims.generateFrameNames("atlas", { prefix: "misa-right-walk.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: "misa-front-walk",
			frames: anims.generateFrameNames("atlas", { prefix: "misa-front-walk.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: "misa-back-walk",
			frames: anims.generateFrameNames("atlas", { prefix: "misa-back-walk.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.create({
            key: 'security-walk-front',
            frames: anims.generateFrameNumbers('security', { start: 3, end: 5 }),
            frameRate: 20,
            repeat: -1
		});
		
		this.anims.create({
            key: 'security-walk-back',
            frames: anims.generateFrameNumbers('security', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: -1
		});
		
		this.anims.create({
            key: 'security-walk-left',
            frames: anims.generateFrameNumbers('security', { start: 6, end: 8 }),
            frameRate: 20,
            repeat: -1
		});
		
		this.anims.create({
            key: 'security-walk-right',
            frames: anims.generateFrameNumbers('security', { start: 9, end: 11 }),
            frameRate: 20,
            repeat: -1
		});
		
		this.anims.create({
            key: 'lightning-bolt',
            frames: anims.generateFrameNumbers('blue-lightning', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });


		this.security.anims.play("security-walk-front", true);
		this.lightning.anims.play("lightning-bolt", true);


		this.gzDialog.init();

		//this.gzDialog.setText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', true);

	}

	update(time, delta) {
		const speed = 225;
		const prevVelocity = this.player.body.velocity.clone();
		// Apply the controls to the camera each update tick of the game
		//this.controls.update(delta);

		if(this.lightning.active){
			let tmpX = this.player.x;
			let tmpY = this.player.y-22;
			let tmpR = 0;

			switch(this.player.direction){
				case 'front':
					tmpX = this.player.x;
					tmpY = this.player.y+30;
					tmpR = 180;
					break;
				case 'left':
					tmpX = this.player.x-20;
					tmpY = this.player.y+15;
					tmpR = 270;
					break;
				case 'right':
					tmpX = this.player.x+20;
					tmpY = this.player.y+15;
					tmpR = 90;
					break;
			}

			this.lightning.x = tmpX;
			this.lightning.y = tmpY;
			this.lightning.setRotation(this._degrees_to_radians(tmpR));
		}

		// Stop any previous movement from the last frame
		if(this.player.isHit > 0){
			this.player.isHit--;

		}else{
			this.player.tint = 0xffffff;
			this.player.body.setVelocity(0);
		}

		if(this.security.isHit > 0){
			this.security.isHit--;

		}else if(this.security.isHit === 0){
			this.security.destroy();
		}

		if( this.gzDialog.visible ){
			if( this.cursors.space.isDown ){
				this.gzDialog.display(false);
			}
		}else if(this.player.isHit <= 0){

			if( this.cursors.space.isDown ){
				this.lightning.setActive(true);
				this.lightning.setVisible(true);
			}else{
				this.lightning.setActive(false);
				this.lightning.setVisible(false);
			}

			// Horizontal movement
			if (this.cursors.left.isDown) {
				console.log('left');
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

		console.log(this.player.texture.firstFrame);
	}


	HitInteractiveLayer(player, target){
		if(target.properties 
			&& target.properties.portal 
			&& target.properties.portal === 'lab') this.scene.start('Lab1', {origin:'Area51'});
		
	}

	HitScript(player, target){
		//console.log('target', target.properties);
		if(target.properties.name && !this.gzDialog.visible)
			this.gzDialog.setText(Script[player.name][target.properties.name], true);
	}

	_degrees_to_radians(degrees)
	{
		var pi = Math.PI;
		return degrees * (pi/180);
	}
	
}
