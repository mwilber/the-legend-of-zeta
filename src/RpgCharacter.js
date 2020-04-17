import Phaser from 'phaser';

export class RpgCharacter extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, image, path, speed }){
        super(scene, x, y, image);

        this.path = path || false;
        this.waypoint = 0;
        this.isHit = -1;
        this.hp = 10;
        this.speed = speed;
        this.image = image;

        scene.physics.world.enable(this, 0);
        scene.add.existing(this);
    }

    update(){
        if(this.isHit > 0){
			this.isHit--;

		}else if(this.isHit === 0){
			this.destroy();
        }
        
        if(this.path) this.DoWalk();
    }

    DoWalk(){
        if(!this.body) return;
        if(this.isHit >= 0) return;

        this.body.setVelocity(0);

        if(
            this.x >= this.path[this.waypoint].x-5 &&
            this.x <= this.path[this.waypoint].x+5 &&
            this.y >= this.path[this.waypoint].y-5 &&
            this.y <= this.path[this.waypoint].y+5
        ){
            this.waypoint++;
            if(this.waypoint >= this.path.length) this.waypoint = 0;
        }
        
        if(this.x < this.path[this.waypoint].x-5){
            this.body.setVelocityX((this.speed*.5));
        }else if(this.x > this.path[this.waypoint].x+5){
            this.body.setVelocityX(-(this.speed*.5));
        }else{
            this.x = this.path[this.waypoint].x;
        }
        if(this.y < this.path[this.waypoint].y-5){
            this.body.setVelocityY((this.speed*.5));
        }else if(this.y > this.path[this.waypoint].y+5){
            this.body.setVelocityY(-(this.speed*.5));
        }else{
            this.y = this.path[this.waypoint].y;
        }

        if (this.body.velocity.x < 0) this.anims.play(this.image+'-walk-left', true);
        else if (this.body.velocity.x > 0) this.anims.play(this.image+'-walk-right', true);
        else if (this.body.velocity.y < 0) this.anims.play(this.image+'-walk-back', true);
        else if (this.body.velocity.y > 0) this.anims.play(this.image+'-walk-front', true);

    }

    DoHit(recoil){
        this.tint = 0xff0000;
        this.isHit = this.hp;
        this.body.setVelocity(recoil.x, recoil.y);
    }
}