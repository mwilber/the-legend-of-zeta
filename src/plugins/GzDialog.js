import Phaser from 'phaser';

export class GzDialog extends Phaser.Plugins.ScenePlugin {

	constructor(scene, pluginManager) {
		super(scene, pluginManager);
		this.scene = scene;
		this.systems = scene.sys;
	}

	//  Called when the Plugin is booted by the PluginManager.
	//  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
	boot() {
		let eventEmitter = this.systems.events;
		eventEmitter.on('update', this.update, this);

		/* 
			List of unused eventEmitters to activate matching methods of this plugin
		*/

		//eventEmitter.on('start', this.start, this);

		//eventEmitter.on('preupdate', this.preUpdate, this);
		//eventEmitter.on('postupdate', this.postUpdate, this);

		//eventEmitter.on('pause', this.pause, this);
		//eventEmitter.on('resume', this.resume, this);

		//eventEmitter.on('sleep', this.sleep, this);
		//eventEmitter.on('wake', this.wake, this);

		//eventEmitter.on('shutdown', this.shutdown, this);
		//eventEmitter.on('destroy', this.destroy, this);*/
	}

	//  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
	start() {}

	//  Called every Scene step - phase 1
	preUpdate(time, delta) {}

	//  Called every Scene step - phase 2
	update(time, delta) {

	}

	//  Called every Scene step - phase 3
	postUpdate(time, delta) {}

	//  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
	pause() {}

	//  Called when a Scene is resumed from a paused state.
	resume() {}

	//  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
	sleep() {}

	//  Called when a Scene is woken from a sleeping state.
	wake() {}

	//  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
	shutdown() {
		if (this.timedEvent) this.timedEvent.remove();
		if (this.text) this.text.destroy();
	}

	//  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
	destroy() {
		this.shutdown();
		this.scene = undefined;
	}

	init(opts) {
		// Check to see if any optional parameters were passed
		if (!opts) opts = {};
		// set properties from opts object or use defaults
		this.borderThickness = opts.borderThickness || 5;
		this.borderColor = opts.borderColor || 0xffffff;
		this.borderAlpha = opts.borderAlpha || 1;
		this.windowAlpha = opts.windowAlpha || 0.95;
		this.windowColor = opts.windowColor || 0x000000;
		this.windowHeight = opts.windowHeight || 150;
		this.padding = opts.padding || 32;
		this.dialogSpeed = opts.dialogSpeed || 3;
		this.scrollFactor = opts.scrollFactor || 0; //scrollFactor of 0 fixes to the camera
		
		// used for animating the text
		this.eventCounter = 0;
		// if the dialog window is shown
		this.visible = false;
		// the current text in the window
		this.text;
		// the text that will be displayed in the window
		this.dialog;
		this.graphics;

		
		// Create the dialog window
		this._drawBackground();
		
		this.display(false);
	}

	// Hide/Show the dialog window
	display(showMe) {
		if(typeof showMe === 'undefined') this.visible = !this.visible;
		else this.visible = showMe;

		if (this.text) this.text.visible = this.visible;
		if (this.graphics) this.graphics.visible = this.visible;
	}

	// Sets the text for the dialog window
	setText(text, animate) {
		if(!text || !text.split) return;
		this.display(true);
		// Reset the dialog
		this.eventCounter = 0;
		this.dialog = text.split('');
		if (this.timedEvent) this.timedEvent.remove();
		
		var tempText = animate ? '' : text;
		this._setText(tempText);
		
		if (animate) {
			this.timedEvent = this.scene.time.addEvent({
				delay: 150 - (this.dialogSpeed * 30),
				callback: this._animateText,
				callbackScope: this,
				loop: true
			});
		}
	}

	// Gets the width of the game (based on the scene)
	_getGameWidth() {
		return this.scene.sys.game.config.width;
	}
   
	// Gets the height of the game (based on the scene)
	_getGameHeight() {
		return this.scene.sys.game.config.height;
	}
	
	// Calculates where to place the dialog window based on the game size
	_calculateWindowDimensions(width, height) {
		var x = this.padding;
		var y = height - this.windowHeight - this.padding;
		var rectWidth = width - (this.padding * 2);
		var rectHeight = this.windowHeight;
		return {
			x,
			y,
			rectWidth,
			rectHeight
		};
	}

	// Creates the dialog window
	_drawBackground() {
		var gameHeight = this._getGameHeight();
		var gameWidth = this._getGameWidth();
		var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
		this.graphics = this.scene.add.graphics().setScrollFactor(this.scrollFactor);

		this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
		this.graphics.fillStyle(this.windowColor, this.windowAlpha);
		this.graphics.strokeRoundedRect(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight, 5);
		this.graphics.fillRoundedRect(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight, 5);
	}

	// Calcuate the position of the text in the dialog window
	_setText(text) {
		// Reset the dialog
		if (this.text) this.text.destroy();
 
		var x = this.padding * 2;
		var y = this._getGameHeight() - this.windowHeight - (this.padding * 0.5);
	   
		this.text = this.scene.make.text({
			x,
			y,
			text,
			style: {
				wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 }
			}
		}).setScrollFactor(this.scrollFactor);
	}

	// Slowly displays the text in the window to make it appear annimated
	_animateText() {
		this.eventCounter++;
		this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
		if (this.eventCounter === this.dialog.length) {
			this.timedEvent.remove();
		}
	}

}