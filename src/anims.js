/**
 * This Anims class is tightly coupled to the Game Scene class and used to 
 * seperate the sprite animation definitions into their own file.
 */
export class Anims {
    constructor(scene){
        if(!scene) return;

        this.scene = scene;
    }

    preload(){
        this.scene.load.atlas("zeta", "assets/sprites/zeta_walk.png", "assets/sprites/zeta_walk.json");
        this.scene.load.spritesheet('security', 
            'assets/sprites/security.png',
            { frameWidth: 36, frameHeight: 42 }
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
    }
}