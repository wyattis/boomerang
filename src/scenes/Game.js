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
    }
    preload(){
        this.load.json('level1', 'levels/world1/level1.json');
        this.load.image('boomerang', 'assets/Boomerarm.png');
        this.load.image('cloud', 'assets/cloud.png');
        this.load.spritesheet('orangeman', 'assets/orangeman.png', {frameWidth: 49, frameHeight: 52});
        this.load.spritesheet('sheet', 'assets/BoomtilesB.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('bouncer', 'assets/Bouncer.png', {frameWidth: 64, frameHeight: 32});
    }
    create(){
        
        this.physics = new PolarPhysics(this);
        this.planetRadius = 3500;
        this.physics.setBounds(this.planetRadius, this.planetRadius + this.game.config.height);
        this.physics.gravity.r = -.1;
        this.bounds = {x:0,y:0,width:this.planetRadius*2 + this.game.config.height,height:this.planetRadius*2 + this.game.config.width};
        this.center = {x: this.bounds.width / 2, y: this.bounds.height / 2};
        // this.boomerang = this.add.sprite(400, 200, 'boomerang');
        this.boomerang = new PolarSprite(this, 0, 0, 'boomerang');
        this.physics.add(this.boomerang);
        this.boomerang.center = this.center;
        this.physics.setGravity(this.boomerang);
        this.boomerang.lockRotation = false;
        
        let config = {
            key: 'bounce',
            frames: this.anims.generateFrameNumbers('bouncer', {start: 0, end: 14, first: 0}),
            frameRate: 10,
            repeat: 3
        };
        this.anims.create(config);
        // debugger;
        // this.boomerang.setVisible(false);
        // this.boomerang.setActive(false);

        
        
        this.arrow = new Arrow(this, 0, 0);
        
        
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

        this.input.events.on('POINTER_DOWN_EVENT', this.pointerDown.bind(this));
        this.input.events.on('POINTER_MOVE_EVENT', this.pointerMove.bind(this));
        this.input.events.on('POINTER_UP_EVENT', this.pointerUp.bind(this));
        
        this.input.keyboard.events.on('KEY_DOWN_A', this.left.bind(this));
        this.input.keyboard.events.on('KEY_DOWN_D', this.right.bind(this));
        this.input.keyboard.events.on('KEY_DOWN_W', this.startJump.bind(this));
        this.input.keyboard.events.on('KEY_UP_W', this.stopJump.bind(this));
        this.input.keyboard.events.on('KEY_DOWN_SPACEBAR', this.startJump.bind(this));
        this.input.keyboard.events.on('KEY_UP_SPACEBAR', this.startJump.bind(this));
        
        console.log(this.cameras.main);
        this.centerOnPoint(this.center, 1000, .07, () => {this.scene.launch('menu')});
        this.makeClouds(100, -200, 300);
        this.level = 0;
        this.createLevels();
        
        // Input stuff
        this.pointerIsDown = false;
        this.startDrag = {};
        this.endDrag = {};
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
        // this.next();
        // console.log('down', event, event.x, event.y);
        this.startDrag.x = event.x;
        this.startDrag.y = event.y;
        this.pointerIsDown = true;
    }
    
    pointerMove(event){
        if(this.pointerIsDown){
            // TODO: Update an arrow on the screen
        }
    }
    pointerUp(event){
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
    
    zoomToLevel( duration=2500){
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
    
    startLevel(){
        console.log('starting level', this.level);
    }
    
    update(){
        this.physics.update();
        // this.rotatePlanet();
        // this.captureThrow();
        
        // if(this.boomerang.alive){

        // }
        // this.cameras.main.rotation += .001;
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
        // this.cameras.main.startFollow(this.boomerang);
    }
    
    
    next(){
        this.boomerang.setActive(false);
        this.boomerang.setVisible(false);
        this.level += 1;
        if(this.level >= this.levels.length){
            this.level = 0;
        }
        this.zoomToLevel();
    }
    
    render(){
        //  this.game.debug.spriteInfo(this.player, 32, 32);
        //  this.game.debug.spriteInfo(this.planet, 400, 32);
        this.game.debug.spriteInfo(this.boomerang, 32, 32);
        this.game.debug.cameraInfo(this.game.camera, 400, 32);
    }
    
    
    createLevels(){
        let level = this.cache.json.get('level1');
        let groundHeight = level.properties.groundHeight;
        let startAngle = 0;
        let angleDelta = (level.tilewidth) / this.planetRadius;
        this.tiles = [];
        this.levels = [];
        let levelConfig = {
            minTheta: startAngle
        };
        for(let h=0; h<level.height; h++){
            for(let w=0; w<level.width; w++){
                let c = level.layers[0].data[w + h*level.width];
                if(!c)
                    continue;
                let r = this.planetRadius + level.tileheight * (level.height - h - .5) - groundHeight*level.tileheight;
                let theta = startAngle + angleDelta * w;
                let x = this.center.x + r * Math.sin(theta);
                let y = this.center.y - r * Math.cos(theta) + groundHeight*level.tileheight;
                if(c===9 || c===10){
                    let p = new PolarSprite(this, theta, r, 'orangeman', 10 - c);
                    // this.physics.add(p);
                    p.center = this.center;
                    this.physics.add(p);
                    p.useGravity = true;
                    p.friction.theta = .00001;

                    this.children.add(p);
                    // p.rotation = theta;
                    levelConfig['player' + (c - 8)] = p;
                } else if(c >= 13 && c <= 16){
                    let bouncer = new PolarSprite(this, theta, r - level.tileheight, 'bouncer').play('bounce');
                    bouncer.center = this.center;
                    this.physics.add(bouncer);
                    this.physics.setStatic(bouncer);
                    bouncer.lockRotation = false;
                    // debugger;
                    let bigE = 1.2;
                    let littleE = .5;
                    let littleDim = level.tileheight / 2 - 15;
                    let bigDim = level.tilewidth;
                    if(c===13 || c===15){
                        bouncer.setSize(bigDim, littleDim);
                        bouncer.elasticity.r = bigE;
                        bouncer.elasticity.theta = littleE;
                    } else if(c===14 || c===16){
                        bouncer.setSize(littleDim, bigDim);
                        bouncer.elasticity.theta = bigE;
                        bouncer.elasticity.r = littleE;
                    }
                    
                    bouncer.updatePosition(theta, r);
                    
                    bouncer.onCollision = (function(bouncer){
                        return function(a){
                            bouncer.anims.play('bounce');
                        };
                    })(bouncer);
                    
                    bouncer.customRCollision = (function(a){
                        // TODO: Add a custom bounce for the 
                        console.log('custom R');
                    }).bind(bouncer);
                    
                    bouncer.customThetaCollision = (function(a){
                        // TODO: Add a custom bounce for the 
                        console.log('custom theta');
                    }).bind(bouncer);
                    
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
                    this.children.add(bouncer);
                } else {
                    let tile;
                    if([1,2,5,6].indexOf(c) === -1){
                        // tile = new PolarSprite(this, theta, - r + groundHeight*level.tileheight, 'sheet', c - 1);
                        tile = new PolarImage(this, theta, r, 'sheet', c - 1);
                        this.physics.add(tile);
                        this.physics.setStatic(tile);
                    } else {
                        tile = new PolarImage(this, theta, r, 'sheet', c-1);
                    }
                    tile.updatePosition(theta, r);
                    tile.center = this.center;
                    this.children.add(tile);
                    // tile.rotation = theta;
                    levelConfig.maxTheta = theta;
                    this.tiles.push(tile);
                }
                
            }
        }
        this.levels.push(levelConfig);
    }

    
}

export default Game;