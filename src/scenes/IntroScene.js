import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'IntroScene'
        });

	}

	preload() {
        this.load.image('title_splash', 'assets/images/title_splash.png');
    }

    create() {
        // Add the background image
        this.splash = this.add.image(400, 300, 'title_splash');
        
        this.splash.setInteractive().on('pointerdown', () => { 
            this.scene.start('Area51');
        });
    }
}