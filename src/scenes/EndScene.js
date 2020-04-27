import Phaser from 'phaser';

export class EndScene extends Phaser.Scene {
    constructor() {
		super({
			key: 'EndScene'
        });

	}

	preload() {
        this.load.image('end_splash', 'assets/images/end_splash.png');
    }

    create() {

        // Reset global player health
        this.game.global.playerHp = -1;

        // Add the background image
        this.splash = this.add.image(400, 300, 'end_splash');
        
        this.splash.setInteractive().on('pointerdown', () => { 
            this.scene.start('IntroScene');
        });
    }
}