/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = Phaser;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scenes_Game__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scenes_Menu__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scenes_Overlay__ = __webpack_require__(8);





var config = {
    type: Phaser.WEBGL,
    backgroundColor: "#4488AA",
    width: 900,
    height: 600,
    scene: [__WEBPACK_IMPORTED_MODULE_1__scenes_Game__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__scenes_Overlay__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__scenes_Menu__["a" /* default */]]
};


const game = new Phaser.Game(config);
game.scene.start('game');

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ui_Arrow__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_PolarPhysics__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_PolarImage__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_PolarSprite__ = __webpack_require__(6);
/*global Phaser*/







class Game extends Phaser.Scene{
    constructor(config={}){
        config.key = 'game';
        super(config);
        this.levelNum = 2;
        
    }
    preload(){
        // Levels
        for(let l=1; l<=this.levelNum; l++){
            this.load.json('level'+l, `assets/levels/world1/level${l}.json`);
        }
        
        // Sprites
        this.load.image('boomerang', 'assets/images/Boomerarm.png');
        this.load.image('cloud', 'assets/images/cloud.png');
        this.load.spritesheet('orangeman', 'assets/images/orangeman.png', {frameWidth: 49, frameHeight: 52});
        this.load.spritesheet('sheet', 'assets/images/BoomtilesB.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('bouncer', 'assets/images/Bouncer.png', {frameWidth: 64, frameHeight: 32});
        
        // Audio
        this.load.audio('boomerinair', 'assets/audio/boomerinair4.wav');
        this.load.audio('boomerinair2', 'assets/audio/boomerinair3.wav');
        this.load.audio('bounce', 'assets/audio/bounce.wav');
        this.load.audio('crash', 'assets/audio/crash.wav');
        this.load.audio('throw', 'assets/audio/throw.wav');
        this.load.audio('collision', 'assets/audio/collision.wav');
        
    }
    create(){
        
        this.sounds = {};
        this.physics = new __WEBPACK_IMPORTED_MODULE_2__components_PolarPhysics__["a" /* default */](this);
        this.planetRadius = 3500;
        this.physics.setBounds(this.planetRadius, this.planetRadius + this.game.config.height);
        this.physics.gravity.r = -.1;
        this.bounds = {x:0,y:0,width:this.planetRadius*2 + this.game.config.height,height:this.planetRadius*2 + this.game.config.width};
        this.center = {x: this.bounds.width / 2, y: this.bounds.height / 2};
        this.boomerang = new __WEBPACK_IMPORTED_MODULE_4__components_PolarSprite__["a" /* default */](this, 0, 0, 'boomerang');
        this.physics.add(this.boomerang);
        this.boomerang.center = this.center;
        this.physics.setGravity(this.boomerang);
        this.boomerang.lockRotation = false;
        
        this.boomerang.onCollision = (function(sounds, boomerang){
            return function(b){
                if(b.type === 'wall'){
                    sounds['crash'].play({
                        volume : (Math.abs(boomerang.velocity.r) + Math.abs(boomerang.velocity.theta * boomerang.r)) / 15
                    });
                } else if(b.type === 'ground'){
                    if(boomerang.velocity.r < -1){
                        sounds['collision'].play({
                            volume : (Math.abs(boomerang.velocity.r) + Math.abs(boomerang.velocity.theta * boomerang.r)) / 15
                        });
                    }
                }
            };
        })(this.sounds, this.boomerang);
        
        let config = {
            key: 'bounce',
            frames: this.anims.generateFrameNumbers('bouncer', {start: 0, end: 14, first: 0}),
            frameRate: 20,
            repeat: 0
        };
        this.anims.create(config);

        
        // this.arrow = new Arrow(this, 0, 0);

        // this.planet = this.game.add.sprite(400, 1000, 'circle');
        let planetGraphics =  this.make.graphics({x: 0, y: 0, add: false});
        // planetGraphics.lineStyle(1, 0xff0000, 1.0);
        planetGraphics.fillStyle(0x60bd37, 1.0);
        planetGraphics.fillCircle(this.planetRadius, this.planetRadius, this.planetRadius);
        planetGraphics.generateTexture('planet', this.planetRadius*2, this.planetRadius*2);
        // this.planet = this.add.image(this.center.x, this.center.y, 'planet');
        this.planet = this.add.image(this.center.x, this.center.y, 'planet');
        // this.planet.setCircle(this.planetRadius);
        // debugger;

        console.log(this.cameras.main);
        this.centerOnPoint(this.center, 1000, .07, () => {this.scene.launch('menu')});
        this.makeClouds(40, -200, 300);
        this.level = 0;

        this.createAudio();
        this.createInput();
        this.createLevels();
        
    }
    
    createAudio(){
        
        this.sounds.boomerinair = this.game.sound.add('boomerinair');
        this.sounds.boomerinair2 = this.game.sound.add('boomerinair2');
        this.sounds.bounce = this.game.sound.add('bounce');
        this.sounds.crash = this.game.sound.add('crash');
        this.sounds.throw = this.game.sound.add('throw');
        this.sounds.collision = this.game.sound.add('collision');
        
    }
    
    createInput(){
        
        this.input.events.on('POINTER_DOWN_EVENT', this.pointerDown.bind(this));
        this.input.events.on('POINTER_MOVE_EVENT', this.pointerMove.bind(this));
        this.input.events.on('POINTER_UP_EVENT', this.pointerUp.bind(this));
        
        this.input.keyboard.events.on('KEY_DOWN_A', this.left.bind(this));
        this.input.keyboard.events.on('KEY_DOWN_D', this.right.bind(this));
        this.input.keyboard.events.on('KEY_DOWN_W', this.startJump.bind(this));
        this.input.keyboard.events.on('KEY_UP_W', this.stopJump.bind(this));
        this.input.keyboard.events.on('KEY_DOWN_SPACEBAR', this.startJump.bind(this));
        this.input.keyboard.events.on('KEY_UP_SPACEBAR', this.startJump.bind(this));
        
        // Input stuff
        this.pointerIsDown = false;
        this.startDrag = {};
        this.endDrag = {};
        
        // Dragging
        this.selectedObject = null;
        
    }
    
    startJump(){
        this.levels[this.level].player1.acceleration.r = .1;
    }
    
    stopJump(){
        this.levels[this.level].player1.acceleration.r = 0;
    }
    
    left(){
        this.levels[this.level].player1.velocity.theta = -0.001;
    }
    
    right(){
        this.levels[this.level].player1.velocity.theta = 0.001;
    }
    
    makeClouds(n, rMin, rMax){
        this.clouds = [];
        for(let i=0; i<n; i++){
            let cloud = this.add.image(this.center.x,  this.center.y, 'cloud');
            this.clouds.push(cloud);
            cloud.rotation = Phaser.Math.FloatBetween(0, Math.PI * 2);
            // debugger;
            cloud.setOrigin(.5, (this.center.y + Phaser.Math.FloatBetween(rMin, rMax) ) / cloud.height);
            cloud.omega = Phaser.Math.FloatBetween(.0001, .0005);
        }
    }
    
    onPause(e){
        this.physics.pause();
        this.animatePause();
        this.scene.launch('menu');
    }

    pointerDown(event){
        let l = this.levels[this.level];
        if(event.gameObject && event.gameObject.moveable){
            event.gameObject.isMoving = true;
            event.gameObject.startMoveCart = {x: event.x, y: event.y};
            event.gameObject.startMovePolar = {r: event.gameObject.r, theta: event.gameObject.theta};
            this.selectedObject = event.gameObject;
        } else {
            this.startDrag.x = event.x;
            this.startDrag.y = event.y;
            this.pointerIsDown = true;
        }
    }
    
    pointerMove(event){
        if(this.selectedObject && this.selectedObject.isMoving){
            if(!this.selectedObject.lockTheta){
                this.selectedObject.theta = this.selectedObject.startMovePolar.theta + (event.x - this.selectedObject.startMoveCart.x) / this.selectedObject.r;
            }
            if(!this.selectedObject.lockR){
                this.selectedObject.r = this.selectedObject.startMovePolar.r - event.y + this.selectedObject.startMoveCart.y;
            }
            this.clampSelectedObject();
        }
        if(this.pointerIsDown){
            // TODO: Update an arrow on the screen
        }
    }
    
    clampSelectedObject(){
        if(!this.selectedObject.bounds)
            return;
        let b = this.selectedObject.bounds;
            
        if(b.minTheta && this.selectedObject.theta < b.minTheta){
            this.selectedObject.theta = b.minTheta;
        } else if(b.maxTheta && this.selectedObject.theta > b.maxTheta){
            this.selectedObject.theta = b.maxTheta;
        }
        if(b.maxR && this.selectedObject.r > b.maxR){
            this.selectedObject.r = b.maxR;
        } else if(b.minR && this.selectedObject.r < b.minR){
            this.selectedObject.r = b.minR;
        }
    }
    
    pointerUp(event){
        if(this.selectedObject)
            this.selectedObject.isMoving = false;
        if(this.pointerIsDown){
            this.endDrag.x = event.x;
            this.endDrag.y = event.y;
            this.pointerIsDown = false;
            // let v = {x: this.endDrag.x - this.startDrag.x, y: this.endDrag.y - this.startDrag.y};
            // debugger;
            let v = new Phaser.Math.Vector2(this.endDrag.x-this.startDrag.x, this.endDrag.y-this.startDrag.y);
            if(v.lengthSq() >= 20*20){
                this.throw(v);
            }
        }
    }
    
    animatePause(){
        this.centerOnPoint(this.center, 1500, .07, ()=>{
            // this.scene.pause();
        });
        this.cameraRotation = this.tweens.add({
            targets: this.cameras.main,
            rotation: Math.PI * 2,
            ease: 'Linear',
            repeat: -1,
            duration: 25000
        });
        console.log(this.scene);
        
    }
    
    animateUnpause(){
        this.scene.resume();
        this.physics.unpause();
        if(this.cameraRotation){
            this.cameraRotation.stop();
        }
        this.zoomToLevel();
    }
    
    centerOnPoint(p, duration=1000, zoom=null, onComplete=null){
        
        return this.tweens.add({
            targets: this.cameras.main,
            props: {
                zoom : {
                    value: zoom || this.cameras.main.zoom,
                    duration: duration,
                    ease: 'Cubic.easeInOut'
                },
                scrollX:  {
                    value: p.x -this.cameras.main.width * 0.5,
                    duration: duration,
                    ease: 'Cubic.easeInOut',
                    delay: duration * .5
                },
                scrollY: {
                    value: p.y - this.cameras.main.height * 0.5,
                    duration: duration,
                    ease: 'Cubic.easeInOut',
                    delay: duration * .5
                },
            },
            onComplete: onComplete
        });

    }
    
    zoomToLevel(duration=2500){
        this.boomerang.setVisible(true);
        this.enableLevelPhysics();
        let lev = this.levels[this.level];
        let middleTheta = (lev.minTheta + lev.maxTheta) /2;
        let center = {x: this.center.x + this.planetRadius * Math.sin(middleTheta), y: this.center.y - this.planetRadius * Math.cos(middleTheta) };
        this.tweens.add({
            targets: this.cameras.main,
            props: {
                scrollX:  {
                    value: center.x - this.cameras.main.width * 0.5,
                    duration: duration / 2
                },
                scrollY:  {
                    value: center.y - this.cameras.main.width * 0.5,
                    duration: duration / 2
                },
                rotation: {
                    value: -middleTheta,
                    duration: duration / 2
                },
                zoom: 1
            },
            duration: duration,
            ease: 'Cubic.easeInOut',
            onComplete: this.startLevel.bind(this)
        });
        
    }
    
    enableLevelPhysics(){
        this.boomerang.setActive(true);
        this.boomerang.setVisible(true);
        let l = this.levels[this.level];
        let p = l.player1;
        p.setVisible(true);
        this.physics.enable(p);
        // this.physics.setStatic(p);
        p.setInteractive();
        p = l.player2;
        p.setVisible(true);
        this.physics.enable(p);
        this.physics.setStatic(p);
        p.onCollision = (function(obj){
            if(obj === this.boomerang){
                this.next();
            }
        }).bind(this);
        for(let bouncer of l.bouncers){
            this.physics.enable(bouncer);
            this.add.updateList.add(bouncer);
            bouncer.setVisible(true);
            bouncer.setInteractive();
        }
        for(let tile of l.tiles){
            this.physics.enable(tile);
        }
    }
    
    disableLevelPhysics(){
        this.boomerang.setActive(false);
        this.boomerang.setVisible(false);
        let l = this.levels[this.level];
        let p = l.player1;
        p.setVisible(false);
        this.physics.setStatic(p, false);
        this.physics.disable(p);
        this.sys.inputManager.disable(p);
        // p.setInteractive();
        p = l.player2;
        p.setVisible(false);
        this.physics.setStatic(p, false);
        this.physics.disable(p);
        p.onCollision = null;
        for(let bouncer of l.bouncers){
            this.physics.disable(bouncer);
            this.add.updateList.add(bouncer);
            bouncer.setVisible(false);
            // bouncer.setInteractive();
            this.sys.inputManager.disable(bouncer);
        }
        for(let tile of l.tiles){
            this.physics.disable(tile);
        }
    }
    
    startLevel(){
        console.log('starting level', this.level);
    }
    
    update(){
        this.physics.update();
        let i = this.clouds.length;
        while(i--){
            this.clouds[i].setRotation(this.clouds[i].rotation + this.clouds[i].omega);
        }

    }
    
    throw(dirMag){
        let l = this.levels[this.level];
        this.children.bringToTop(this.boomerang);
        this.boomerang.setVisible(true);
        this.boomerang.setActive(true);
        
        this.boomerang.updatePosition(l.player1.theta, l.player1.r);
        // this.boomerang.r = l.player1.r;
        // this.boomerang.theta = l.player1.theta;
        this.children.bringToTop(l.player2);
        // l.player2.updatePosition(l.player1.theta, l.player1.r);
        
        dirMag.scale(.02);
        this.boomerang.velocity.theta = dirMag.x / this.boomerang.r;
        this.boomerang.velocity.r = -dirMag.y;
        this.boomerang.velocity.angular = Phaser.Math.Clamp(dirMag.lengthSq() / 40, 0, 15);
        console.log(this.boomerang.x, this.boomerang.y, dirMag.x, dirMag.y);
        // this.boomerang.setdirMagocity(dirMag.x, dirMag.y);
        this.throwCount ++;
        console.log("Throw!");
        this.sounds['throw'].play();
        this.sounds['boomerinair'].play({
            volume : .6
        });
        this.sounds['boomerinair2'].play({
            volume : .3
        });
        // this.cameras.main.startFollow(this.boomerang);
    }
    
    next(){
        this.disableLevelPhysics();
        this.level += 1;
        if(this.level >= this.levels.length){
            this.level = 0;
        }
        this.zoomToLevel();
    }
    
    createLevels(){
        let startAngle = 0;
        this.tiles = [];
        this.levels = [];
        for(let l=0; l<this.levelNum; l++){
            let level = this.cache.json.get('level' + (l+1));
            let groundHeight = level.properties.groundHeight || 1;
            let angleDelta = (level.tilewidth) / this.planetRadius;
            let levelConfig = {
                minTheta: startAngle,
                bouncers: [],
                tiles: []
            };
            for(let h=0; h<level.height; h++){
                for(let w=0; w<level.width; w++){
                    let c = level.layers[0].data[w + h*level.width];
                    if(!c)
                        continue;
                    let r = this.planetRadius + level.tileheight * (level.height - h - .5) - groundHeight*level.tileheight;
                    let theta = startAngle + angleDelta * w;
                    if(c===9 || c === 10){
                        if(c=== 9 && l > 0){
                            levelConfig.player1 = this.levels[l-1].player2;
                        } else {
                            let p = new __WEBPACK_IMPORTED_MODULE_4__components_PolarSprite__["a" /* default */](this, theta, r, 'orangeman', 10 - c);
                            // debugger;
                            p.r += level.tileheight / 4;
                            console.log('player' + (c - 8), p.r, p.x, p.y)
                            this.physics.add(p);
                            p.useGravity = true;
                            p.friction.theta = .00005;
                            levelConfig['player' + (c - 8)] = p;
                            this.physics.disable(p);
                            this.children.add(p);
                            p.setVisible(false);
                        }
                    } else if(c >= 13 && c <= 16){
                        let bouncer = new __WEBPACK_IMPORTED_MODULE_4__components_PolarSprite__["a" /* default */](this, theta, r - level.tileheight, 'bouncer');
                        bouncer.moveable = true;
                        bouncer.type = 'bouncer';
                        bouncer.center = this.center;
                        this.physics.add(bouncer);
                        this.physics.setStatic(bouncer);
                        bouncer.lockRotation = false;
                        let bigE = 1.2;
                        let littleE = .5;
                        let littleDim = level.tileheight / 2 - 15;
                        let bigDim = level.tilewidth / 2;
                        if(c===13 || c===15){
                            bouncer.setSize(bigDim, littleDim);
                            bouncer.elasticity.r = bigE;
                            bouncer.elasticity.theta = littleE;
                            bouncer.lockR = true;
                        } else if(c===14 || c===16){
                            bouncer.setSize(littleDim, bigDim);
                            bouncer.elasticity.theta = bigE;
                            bouncer.elasticity.r = littleE;
                            bouncer.lockTheta = true;
                        }
                        
                        bouncer.updatePosition(theta, r);
                        
                        bouncer.onCollision = (function(sounds, bouncer){
                            return function(a){
                                let v = (Math.abs(a.velocity.r) + Math.abs(a.velocity.theta * a.r)) / 15;
                                sounds['bounce'].play({
                                    volume: v > 1 ? 1 : v
                                });
                                bouncer.anims.play('bounce');
                            };
                        })(this.sounds, bouncer);
                        
                        if(c===14){
                            // bouncer.r += level.tileheight;
                            bouncer.rotation = theta + Math.PI / 2;
                        } else if(c===15){
                            // bouncer.r += level.tileheight;
                            bouncer.rotation = theta + Math.PI;
                        } else if(c===16){
                            // bouncer.r += level.tileheight;
                            bouncer.rotation = theta - Math.PI / 2;
                        }
                        levelConfig.bouncers.push(bouncer);
                        this.physics.disable(bouncer);
                        this.children.add(bouncer);
                        bouncer.setVisible(false);
                    } else {
                        let tile;
                        if([1,2,5,6].indexOf(c) === -1){
                            // tile = new PolarSprite(this, theta, - r + groundHeight*level.tileheight, 'sheet', c - 1);
                            tile = new __WEBPACK_IMPORTED_MODULE_3__components_PolarImage__["a" /* default */](this, theta, r, 'sheet', c - 1);
                            tile.type = 'wall';
                            this.physics.add(tile);
                            this.physics.setStatic(tile);
                            this.physics.disable(tile);
                            levelConfig.tiles.push(tile);
                        } else {
                            tile = new __WEBPACK_IMPORTED_MODULE_3__components_PolarImage__["a" /* default */](this, theta, r, 'sheet', c - 1);
                            tile.type = 'ground';
                        }
                        tile.center = this.center;
                        tile.updatePosition(theta, r);
                        // TODO: optimize rendering????
                        this.children.add(tile);
                        // tile.rotation = theta;
                        levelConfig.maxTheta = theta;
                        // this.physics.add(tile);
                        // this.tiles.push(tile);
                    }
                    
                }
            }
            this.levels.push(levelConfig);
            
            
            startAngle = levelConfig.maxTheta - angleDelta * 4;
        }
    }

    
}

/* harmony default export */ __webpack_exports__["a"] = (Game);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/*global Phaser*/
class Arrow extends Phaser.GameObjects.Graphics{
    constructor(scene, x, y){
        super(scene, x, y);
    }
    
}

/* unused harmony default export */ var _unused_webpack_default_export = (Arrow);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PolarPhysics{
    constructor(scene){
        this.scene = scene;
        this.bodies = [];
        this.disabledBodies = [];
        this.isPaused = true;
        this.thetaTol = .00001;
        this.rTol = .01;
        this.angularTol = .001;
        this.gravity = {
            _theta: 0,
            _r: 0,
            set theta(theta){
                this._theta = theta;
            },
            get theta(){
                return this._theta;
            },
            set r(r){
                this._r = r;
            },
            get r(){
                return this._r;
            }
        };
        this.bounds = {
            rMin: 0,
            rMax: 10000
        };
    }
    setBounds(rMin, rMax){
        this.bounds.rMin = rMin;
        this.bounds.rMax = rMax;
    }
    disable(obj){
        let index = this.bodies.indexOf(obj);
        if(index > -1){
            this.disabledBodies.push(this.bodies.splice(index, 1)[0]);
        } else {
            console.error("Unable to disable body that hasn't been added");
        }
    }
    enable(obj){
        let index = this.disabledBodies.indexOf(obj);
        if(index > -1){
            this.bodies.push(this.disabledBodies.splice(index, 1)[0]);
        } else {
            console.error("Unable to enable body that hasn't been added or disabled");
        }
    }
    add(obj){
        obj.elasticity = {
            theta: .2,
            r: .2,
            angular: 0
        };
        obj.velocity = {
            theta: 0,
            r: 0,
            angular: 0
        };
        obj.acceleration = {
            theta: 0,
            r: 0,
            angular: 0
        };
        obj.friction = {
            theta: 0,
            r: 0,
            angular: 0
        };

        obj.lockRotation = true;
        obj.isStatic = false;
        obj.useGravity = false;
        this.bodies.push(obj);
        return obj;
    }
    pause(){
        this.isPaused = true;
    }
    unpause(){
        this.isPaused = false;
    }
    setElasticity(obj, val=1){
        obj.elasticity = val;
    }
    setGravity(obj, val=true){
        obj.useGravity = val;
    }
    setStatic(obj, val=true){
        if(val){
            obj.useGravity = false;
        }
        obj.isStatic = val;
    }
    update(time, delta){
        
        if(this.isPaused) {
            return;
        }
        
        let i = this.bodies.length;
        while(i--){
            // Radius
            // if(this.bodies[i].isStatic){
            //     return;
            // }
            
            if(this.bodies[i].useGravity){
                this.bodies[i].velocity.r += this.gravity.r;
            }
            this.bodies[i].velocity.r += this.bodies[i].acceleration.r;
            if(this.bodies[i].velocity.r > this.rTol){
                this.bodies[i].velocity.r -= this.bodies[i].friction.r;
            } else if(this.bodies[i].velocity.r < -this.rTol){
                this.bodies[i].velocity.r += this.bodies[i].friction.r;
            } else{
                this.bodies[i].velocity.r = 0;
            }
            this.bodies[i].r += this.bodies[i].velocity.r;
            this.radiusCollision(i);
            
           
            
            // Theta
            this.bodies[i].hasCollided = false;
            if(this.bodies[i].useGravity){
                this.bodies[i].velocity.theta += this.gravity.theta;
            }
            this.bodies[i].velocity.theta += this.bodies[i].acceleration.theta;
            if(this.bodies[i].velocity.theta > this.thetaTol){
                this.bodies[i].velocity.theta -= this.bodies[i].friction.theta;
            } else if(this.bodies[i].velocity.theta < -this.thetaTol){
                this.bodies[i].velocity.theta += this.bodies[i].friction.theta;
            } else{
                this.bodies[i].velocity.theta = 0;
            }
            this.bodies[i].theta += this.bodies[i].velocity.theta;
            this.thetaCollision(i);
            
            
            // Boundary collision
            if(this.bodies[i].top > this.bounds.rMax){
                if(this.bodies[i].onCollision){
                    this.bodies[i].onCollision({
                        type: 'ground'
                    });
                }
                this.bodies[i].r = this.bounds.rMax - this.bodies[i].height * this.bodies[i].originY;
                this.bodies[i].velocity.r = 0;
            } else if(this.bodies[i].bottom < this.bounds.rMin){
                if(this.bodies[i].onCollision){
                    this.bodies[i].onCollision({
                        type: 'ground'
                    });
                }
                this.bodies[i].r = this.bounds.rMin + this.bodies[i].height * this.bodies[i].originY;
                this.bodies[i].velocity.r = 0;
                this.bodies[i].velocity.angular *= .9;
            }
            
            
            // Rotation
            if(!this.bodies[i].lockRotation){
                this.bodies[i].velocity.angular += this.bodies[i].acceleration.angular;
                if(this.bodies[i].velocity.angular > this.angularTol){
                    this.bodies[i].velocity.angular -= this.bodies[i].friction.angular;
                } else if(this.bodies[i].velocity.angular < -this.angularTol){
                    this.bodies[i].velocity.angular += this.bodies[i].friction.angular;
                } else{
                    this.bodies[i].velocity.angular = 0;
                }
                this.bodies[i].rotation += this.bodies[i].velocity.angular;
            }
            
        }
        // this.collisionCheck();
    }
    
    intersects(a, b){
        return !( a.left > b.right
        || a.right < b.left
        || a.top < b.bottom
        || a.bottom > b.top);
    }
    
    thetaCollision(i){
        let j = this.bodies.length;
        while(j--){
            if(i !== j ){
                let a = this.bodies[i];
                let b = this.bodies[j];
                // console.log(a.isStatic, b.isStatic);
                if(!a.hasCollided && !b.hasCollided && !((a.isStatic && b.isStatic ) || (!a.isStatic && !b.isStatic))){
                    // if(a.velocity.theta > 0)
                    //     console.log(a.left, a.right, a.top, a.bottom);
                    if(this.intersects(a, b)){
                        a.hasCollided = true;
                        if(a.onCollision){
                            a.onCollision(b);
                        }
                        if(b.onCollision){
                            b.onCollision(a);
                        }
                        if(b.isStatic){
                            a.theta -= a.velocity.theta;
                            a.velocity.theta *= -b.elasticity.theta;
                        } else {
                            // debugger;
                            b.theta -= b.velocity.theta;
                            b.velocity.theta *= -a.elasticity.theta;
                        }
                    }
                }
            }
        }
    }
    
    radiusCollision(i){
        let j = this.bodies.length;
        while(j--){
            if(i !== j ){
                let a = this.bodies[i];
                let b = this.bodies[j];
                if(!a.hasCollided && !b.hasCollided && !((a.isStatic && b.isStatic ) || (!a.isStatic && !b.isStatic))){
                    if(this.intersects(a, b)){
                        a.hasCollided = true;
                        if(a.onCollision){
                            a.onCollision(b);
                        }
                        if(b.onCollision){
                            b.onCollision(a);
                        }
                        if(b.isStatic){
                            a.r -= a.velocity.r;
                            a.velocity.r *= -b.elasticity.r;
                        } else {
                            b.r -= b.velocity.r;
                            b.velocity.r *= -a.elasticity.r;
                        }
                    }
                }
            }
        }
    }
    
    collisionCheck(){
        let i = this.bodies.length;
        while(i--){
            let j = this.bodies.length;
            while(j--){
                if(i !== j ){
                    let a = this.bodies[i];
                    let b = this.bodies[j];
                    // console.log(a.isStatic, b.isStatic);
                    if(!a.hasCollided && !b.hasCollided && !((a.isStatic && b.isStatic ) || (!a.isStatic && !b.isStatic))){
                        // if(a.velocity.theta > 0)
                        //     console.log(a.left, a.right, a.top, a.bottom);
                        if(this.intersects(a, b)){
                            a.hasCollided = true;
                            if(b.isStatic){
                                a.velocity.theta *= -1;
                                a.theta += a.velocity.theta;
                            } else {
                                // debugger;
                                b.velocity.theta *= -1;
                                b.theta += b.velocity.theta;
                            }
                        }
                    }
                }
            }
            // debugger;
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (PolarPhysics);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);


class PolarSprite extends Phaser.GameObjects.Sprite{
    constructor(game, theta, r, cacheKey, frame, config){
        super(game, 0, 0, cacheKey, frame, config);
        this._r = r;
        this._theta = theta;
        this._center = game.center || {x:0, y:0};
        this.lockRotation = true;
        this.updatePosition(theta, r);
    }
    
    updatePosition(theta, r){
        this.r = r;
        this.theta = theta;
    }
    
    get left(){
        return this._left;
    }
    
    get right(){
        return this._right;
    }
    
    get top(){
        return this._top;
    }
    
    get bottom(){
        return this._bottom;
    }
    
    set center(c){
        this._center = c;
    }
    
    get center(){
        return this._center;
    }
    
    set r(r){
        this._r = r;
        this._bottom = r - this.height * this.originY;
        this._top = r + this.height * this.originY;
        this.updateCartesian();
    }
    
    set theta(theta){
        if(theta > 2*Math.PI){
            // debugger;
            this._theta = theta - 2 * Math.PI;
        } else if(theta < 0){
            // debugger;
            this._theta = 2*Math.PI - theta;
        } else {
            this._theta = theta;
        }
        this._left = this._theta - (this.width * this.originX) / this.r;
        this._right = this._theta + (this.width * this.originX) / this.r;
        if(this.lockRotation){
            this.setRotation(this._theta);
        }
        this.updateCartesian();
    }
    
    updateCartesian(){
        this.x = this._center.x + this._r * Math.sin(this._theta);
        this.y = this._center.y - this._r * Math.cos(this._theta);
    }
    
    get r(){
        return this._r;
    }
    
    get theta(){
        return this._theta;
    }
    
}


/* harmony default export */ __webpack_exports__["a"] = (PolarSprite);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);


class PolarSprite extends Phaser.GameObjects.Sprite{
    constructor(game, theta, r, cacheKey, frame, config){
        super(game, 0, 0, cacheKey, frame, config);
        this._r = r;
        this._theta = theta;
        this._center = game.center || {x:0, y:0};
        this.lockRotation = true;
        this.updatePosition(theta, r);
    }
    
    updatePosition(theta, r){
        this.r = r;
        this.theta = theta;
    }
    
    get left(){
        return this._left;
    }
    
    get right(){
        return this._right;
    }
    
    get top(){
        return this._top;
    }
    
    get bottom(){
        return this._bottom;
    }
    
    set center(c){
        this._center = c;
    }
    
    get center(){
        return this._center;
    }
    
    set r(r){
        this._r = r;
        this._bottom = r - this.height * this.originY;
        this._top = r + this.height * this.originY;
        this.updateCartesian();
    }
    
    set theta(theta){
        if(theta > 2*Math.PI){
            // debugger;
            this._theta = theta - 2 * Math.PI;
        } else if(theta < 0){
            // debugger;
            this._theta = 2*Math.PI - theta;
        } else {
            this._theta = theta;
        }
        this._left = this._theta - (this.width * this.originX) / this.r;
        this._right = this._theta + (this.width * this.originX) / this.r;
        if(this.lockRotation){
            this.setRotation(this._theta);
        }
        this.updateCartesian();
    }
    
    updateCartesian(){
        this.x = this._center.x + this._r * Math.sin(this._theta);
        this.y = this._center.y - this._r * Math.cos(this._theta);
    }
    
    get r(){
        return this._r;
    }
    
    get theta(){
        return this._theta;
    }
    
}


/* harmony default export */ __webpack_exports__["a"] = (PolarSprite);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);


class Menu extends Phaser.Scene{
    constructor(config={}){
        config.key = 'menu';
        super(config);
    }
    preload(){
        this.load.image('play', 'assets/images/play.png');
        this.load.image('menu-background', 'assets/images/menu-background.png');
    }
    create(){
        this.scene.bringToTop();
        // let background = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'menu-background');
        // background.setScale(.7);
        this.play = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'play').setInteractive();
        this.input.events.on('GAME_OBJECT_DOWN_EVENT', this.onPlay.bind(this));
    }
    hide(){
        this.scene.setActive(false);
        this.scene.setVisible(false);
    }
    show(){
        this.scene.setActive(true);
        this.scene.setVisible(true);
    }
    onPlay(e){
        if(e.gameObject === this.play){
            let game = this.scene.get('game');
            game.animateUnpause();
            this.scene.swap('overlay');
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Menu);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_phaser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_phaser__);


class Overlay extends Phaser.Scene{
    constructor(config={}){
        config.key='overlay';
        config.backgroundColor= 0x44000044;
        super(config);
    }
    preload(){
        this.load.image('pause', 'assets/images/pause.png');
    }
    create(){
        this.pauseButton = this.add.image(32, 32, 'pause').setInteractive();
        this.input.events.on('GAME_OBJECT_DOWN_EVENT', this.onPause.bind(this));
    }
    onPause(e){
        if(e.gameObject === this.pauseButton){
            let game = this.scene.get('game');
            game.animatePause();
            // let menu = this.scene.get('menu');
            this.scene.swap('menu');
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Overlay);

/***/ })
/******/ ]);
//# sourceMappingURL=boomerang.js.map