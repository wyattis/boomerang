/*global Phaser*/
import 'phaser';
import Arrow from '../ui/Arrow';
import PolarPhysics from '../components/PolarPhysics';
import PolarImage from '../components/PolarImage';
import PolarSprite from '../components/PolarSprite';


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
        this.physics = new PolarPhysics(this);
        this.planetRadius = 3500;
        this.physics.setBounds(this.planetRadius, this.planetRadius + this.game.config.height);
        this.physics.gravity.r = -.1;
        this.bounds = {x:0,y:0,width:this.planetRadius*2 + this.game.config.height,height:this.planetRadius*2 + this.game.config.width};
        this.center = {x: this.bounds.width / 2, y: this.bounds.height / 2};
        this.boomerang = new PolarSprite(this, 0, 0, 'boomerang');
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
                            let p = new PolarSprite(this, theta, r, 'orangeman', 10 - c);
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
                        let bouncer = new PolarSprite(this, theta, r - level.tileheight, 'bouncer');
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
                            tile = new PolarImage(this, theta, r, 'sheet', c - 1);
                            tile.type = 'wall';
                            this.physics.add(tile);
                            this.physics.setStatic(tile);
                            this.physics.disable(tile);
                            levelConfig.tiles.push(tile);
                        } else {
                            tile = new PolarImage(this, theta, r, 'sheet', c - 1);
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

export default Game;