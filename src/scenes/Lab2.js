import Phaser from 'phaser';

export class Lab2 extends Phaser.Scene {
    constructor() {
		super({
            key: 'Lab2'
        });

        this.controls = null; // User controls
        this.cursors = null;
        this.player = null;
	}

	preload() {
        this.load.image("seckrit-lab-tiles", "assets/images/scifitiles-sheet.png");
        this.load.tilemapTiledJSON("lab-2", "assets/tilemaps/lab-2.json");

        this.load.atlas("atlas", "assets/images/zeta_walk.png", "assets/sprites/atlas.json");
    }

    create() {
        const map = this.make.tilemap({ key: "lab-2" });

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("seckrit-lab", "seckrit-lab-tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer("Background", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("Interactive", tileset, 0, 0);
        

        belowLayer.setCollisionByProperty({ collide: true });
        worldLayer.setCollisionByProperty({ collide: true });
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // });

        this.player = this.physics.add.sprite(400, 600, "atlas", "misa-front").setSize(30, 40).setOffset(0, 24);

        this.physics.add.collider(this.player, belowLayer);
        this.physics.add.collider(this.player, worldLayer, this.HitInteractiveLayer.bind(this));

        const aboveLayer = map.createStaticLayer("Overhead", tileset, 0, 0);

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

    }

    update(time, delta) {
        const speed = 225;
        const prevVelocity = this.player.body.velocity.clone();
        // Apply the controls to the camera each update tick of the game
        //this.controls.update(delta);

        // Stop any previous movement from the last frame
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            console.log('left');
            this.player.body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(speed);
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
        console.log("Lab2 -> HitInteractiveLayer -> target", target)
        if(target.properties 
            && target.properties.portal ){

                if(target.properties.portal === 'ascend') this.scene.start('Lab1', {origin: 'Lab2'});
            }
        
    }
    
}
