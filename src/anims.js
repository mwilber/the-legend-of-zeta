export class Anims {
    constructor(scene){
        if(!scene) return;

        this.scene = scene;
    }

    preload(){
        this.scene.load.atlas("zeta", "assets/images/zeta_walk.png", "assets/sprites/atlas.json");
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
			key: "zeta-walk-left",
			frames: anims.generateFrameNames("zeta", { prefix: "zeta-walk-left.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: "zeta-walk-right",
			frames: anims.generateFrameNames("zeta", { prefix: "zeta-walk-right.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: "zeta-walk-front",
			frames: anims.generateFrameNames("zeta", { prefix: "zeta-walk-front.", start: 0, end: 3, zeroPad: 3 }),
			frameRate: 10,
			repeat: -1
		});
		anims.create({
			key: "zeta-walk-back",
			frames: anims.generateFrameNames("zeta", { prefix: "zeta-walk-back.", start: 0, end: 3, zeroPad: 3 }),
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