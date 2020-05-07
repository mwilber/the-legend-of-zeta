import { GameScene } from '../GameScene';

/**
 * Lab 2 Level scene
 */
export class Lab2 extends GameScene {
	constructor(){
        super('Lab2');
        
        this.portals.ascend = 'Lab1';
	}

	init(data){
		this.spawnPoint = {
            x:400,
            y:600
        };
	}

	preload(){
		this.load.image('seckrit-lab-tiles', 'assets/images/scifitiles-sheet.png');
        this.load.tilemapTiledJSON('lab-2', 'assets/tilemaps/lab-2.json');

		super.preload();
	}

	create(){
		super.create({
			tileKey: 'seckrit-lab-tiles',
			mapKey: 'lab-2',
			tiledKey: 'seckrit-lab'
		});

	}

	update(){
		super.update();

		//this.sentry.update();
	}
}