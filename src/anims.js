export class Anims {
    constructor(scene){
        if(!scene) return;

        this.scene = scene;
    }

    preload(){
        this.scene.load.atlas("atlas", "assets/images/zeta_walk.png", "assets/sprites/atlas.json");
        this.scene.load.spritesheet('security', 
            'assets/sprites/security.png',
            { frameWidth: 36, frameHeight: 42 }
		);
		
		this.scene.load.spritesheet('blue-lightning', 
            'assets/sprites/blue-lightning.png',
            { frameWidth: 16, frameHeight: 32 }
        );
    }

    create(){
        const anims = this.scene.anims;

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

		anims.create({
            key: 'security-walk-front',
            frames: anims.generateFrameNumbers('security', { prefix:'security-walk-front', start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
		});
		
		anims.create({
            key: 'security-walk-back',
            frames: anims.generateFrameNumbers('security', { prefix:'security-walk-back', start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
		});
		
		anims.create({
            key: 'security-walk-left',
            frames: anims.generateFrameNumbers('security', { prefix:'security-walk-left', start: 6, end: 8 }),
            frameRate: 15,
            repeat: -1
		});
		
		anims.create({
            key: 'security-walk-right',
            frames: anims.generateFrameNumbers('security', { prefix:'security-walk-right', start: 9, end: 11 }),
            frameRate: 15,
            repeat: -1
		});
		
		anims.create({
            key: 'lightning-bolt',
            frames: anims.generateFrameNumbers('blue-lightning', { start: 0, end: 3 }),
            frameRate: 20,
            repeat: -1
        });
    }
}