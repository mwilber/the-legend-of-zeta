import Phaser from 'phaser';

export class RpgCharacter extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, image, path }){
        super(scene, x, y, image);

        this.path = path || false;
        this.isHit = -1;

        scene.physics.world.enable(this, 0);
        scene.add.existing(this);
    }
}