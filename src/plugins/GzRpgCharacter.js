import Phaser from 'phaser';

/**
 * Parent class for all PC and NPC characters
 */
export class RpgCharacter extends Phaser.GameObjects.Sprite {
    constructor({ scene, x, y, image, name, path, speed }){
        super(scene, x, y, image);

        this.path = path || false;
        this.waypoint = 0;
        this.isHit = -1;
        this.hp = 3;
        this.name = name || "anonymous";
        this.speed = speed;
        this.image = image;

        // Character movements are passed as instruction objects to
        // be evaluated on the next call to update
        this.instructions = [];

        // Attach this sprite to the loaded physics engine
        scene.physics.world.enable(this, 0);
        // Add this sprite to the scene
        scene.add.existing(this);
    }

    update(){

        if(this.isHit > 0){
            // While a character is hit, count dowm on each update to allow for recovery time
			this.isHit--;
		}else if(this.isHit === 0){
            // Character has recovered, reset their hit state
            this.tint = 0xffffff;
            this.isHit = -1;
        }else{
            // Always reset the local velocity to maintain a constant acceleration
            this.body.setVelocity(0);
            // Pre-programmed characters push appropriate walk instructions to follow their path
            if(this.path) this.DoPatrol();
            // Process the instructions array
            this.DoInstructions();
            // Stop animations when not moving
            if(this.body && this.body.velocity.x == 0 && this.body.velocity.y == 0){ 
                this.anims.stopOnRepeat()
            }
        }
        
    }

    /**
     * Cancel local velocity and stop animation
     */
    DoHalt(){
        this.body.setVelocity(0);
        this.anims.stopOnRepeat();
    }

    /**
     * Push a provided instruction object onto the stack
     */
    SetInstruction(instruction){
        if(!instruction.action) return;
        // Walking requires a direction
        if(instruction.action == 'walk' && !instruction.option) return;

        this.instructions.push(instruction);
    }

    /**
     * Process the current instruction stack
     */
    DoInstructions(){
        while(this.instructions.length > 0){
            // Unload the first instruction from the stack
            let instruction = this.instructions.pop();
            switch(instruction.action){
                case 'walk':
                    this.DoWalk(instruction.option);
                    break;
            }
        }
    }

    /**
     * Process a walk instruction
     */
    DoWalk(direction){
        switch(direction){
            case 'left':
                this.body.setVelocityX(-this.speed);
                break;
            case 'right':
                this.body.setVelocityX(this.speed);
                break;
            case 'back':
                this.body.setVelocityY(-this.speed);
                break;
            case 'front':
                this.body.setVelocityY(this.speed);
                break;
        }

        this.body.velocity.normalize().scale(this.speed);

        if (this.body.velocity.y < 0) this.anims.play(this.image+'-walk-back', true);
        else if (this.body.velocity.y > 0) this.anims.play(this.image+'-walk-front', true);
        else if (this.body.velocity.x < 0) this.anims.play(this.image+'-walk-left', true);
        else if (this.body.velocity.x > 0) this.anims.play(this.image+'-walk-right', true);
    }

    /** 
     * Push appropriate walk instructions onto the instruction stack 
     * to follow the programmed path.
     */
    DoPatrol(){
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
            //this.body.setVelocityX((this.speed*.5));
            this.SetInstruction({action: 'walk', option: 'right'});
        }else if(this.x > this.path[this.waypoint].x+5){
            //this.body.setVelocityX(-(this.speed*.5));
            this.SetInstruction({action: 'walk', option: 'left'});
        }else{
            this.x = this.path[this.waypoint].x;
        }
        if(this.y < this.path[this.waypoint].y-5){
            //this.body.setVelocityY((this.speed*.5));
            this.SetInstruction({action: 'walk', option: 'front'});
        }else if(this.y > this.path[this.waypoint].y+5){
            this.SetInstruction({action: 'walk', option: 'back'});
            //this.body.setVelocityY(-(this.speed*.5));
        }else{
            this.y = this.path[this.waypoint].y;
        }

    }

    /** 
     * Handle a damaging collision
     */
    DoHit(source, target){
        target.tint = 0xff0000;
        target.isHit = target.hp*5;
        target.hp--;
        target.body.setVelocity(-(source.x-target.x)*10, -(source.y-target.y)*10);
        source.body.setVelocity(0);
    }
}

export class GzRpgCharacterPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager){
        super(pluginManager);

        //  Register our new Game Object type
        pluginManager.registerGameObject('rpgcharacter', this.createRpgCharacter);
    }

    createRpgCharacter(params){
        return new RpgCharacter({scene: this.scene, ...params});
    }

}