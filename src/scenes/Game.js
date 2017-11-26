/*global Phaser*/
import 'phaser';
import Arrow from '../ui/Arrow';

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
        this.load.spritesheet('sheet', 'assets/Boomtiles.png', {frameWidth: 16, frameHeight:16, padding:0});
    }
    create(){
        
        // this.scene.launch('overlay');
        // debugger;
        this.physics.world.engine.positionIterations = 10;
        this.physics.world.engine.velocityIterations = 10;
        this.planetRadius = 3500;
        this.gravity = 180;
        this.bounds = {x:0,y:0,width:this.planetRadius*2 + this.game.config.height,height:this.planetRadius*2 + this.game.config.width};
        this.physics.world.setBounds(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
        this.center = {x: this.bounds.width / 2, y: this.bounds.height / 2};
        this.boomerang = this.physics.add.sprite(400, 200, 'boomerang', {
            mass: 2
        });
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
        this.planet = this.physics.add.image(this.center.x, this.center.y, 'planet', {
            isStatic: true, 
            isCircle: true, 
            plugin: {
                attractors: [function(a, b){
                    return {
                        x: (a.position.x - b.position.x) * 0.000001,
                        y: (a.position.y - b.position.y) * 0.000001
                    };
                }]
            }
        });
        // this.planet.setCircle(this.planetRadius);
        // debugger;

        // this.physics.add.collider(this.boomerang, this.planet);
        // this.physics.add.collider(this.boomerang, this.player2);
        
        this.input.events.on('POINTER_DOWN_EVENT', this.pointerDown.bind(this));
        this.input.events.on('POINTER_MOVE_EVENT', this.pointerMove.bind(this));
        this.input.events.on('POINTER_UP_EVENT', this.pointerUp.bind(this));
        
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
        this.physics.world.engine.enableSleeping = true;
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
        debugger;
        this.physics.world.engine.enableSleeping = false;
        this.scene.resume();
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
        
        // this.rotatePlanet();
        // this.captureThrow();
        
        // if(this.boomerang.alive){
            // this.game.physics.arcade.collide(this.boomerang, this.planet);
            // this.game.physics.arcade.collide(this.boomerang, this.player2);
        // }
        // this.cameras.main.rotation += .001;
        let i = this.clouds.length;
        while(i--){
            this.clouds[i].setRotation(this.clouds[i].rotation + this.clouds[i].omega);
        }

    }
    
    throw(vel){
        let l = this.levels[this.level];
        this.boomerang.setVisible(true);
        this.boomerang.setActive(true);
        // debugger;
        let r = l.player1.originY * l.player1.height;
        this.boomerang.x = l.player1.x + r * Math.sin(l.player1.rotation) + l.player1.originX * l.player1.width;
        this.boomerang.y = l.player1.y - r * Math.cos(l.player1.rotation);
        // debugger;
        console.log(this.boomerang.x, this.boomerang.y);
        // debugger;
        
        vel.normalize().scale(10);
        this.boomerang.setVelocity(vel.x, vel.y);
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
                // Player 1
                // if(c === 9){
                //     let p = this.add.sprite(this.center.x, this.center.y, 'orangeman', 1);
                //     p.setOrigin(.5, (p.height * (level.height - h) + this.planetRadius) / p.height - groundHeight - 1);
                //     p.rotation = startAngle + angleDelta*w;
                //     levelConfig.player1 = p;
                // }
                // else if(c===10){
                //     let p = this.add.sprite(this.center.x, this.center.y, 'orangeman', 0);
                //     p.setOrigin(.5, (p.height * (level.height - h) + this.planetRadius) / p.height - groundHeight - 1);
                //     p.rotation = startAngle + angleDelta*w;
                //     levelConfig.player2 = p;
                // } else {
                //     let tile = this.add.image(this.center.x, this.center.y, 'sheet', c - 1);
                //     tile.setOrigin(.5, (tile.height * (level.height - h) + this.planetRadius) / tile.height - groundHeight);
                //     tile.rotation = startAngle + angleDelta*w;
                //     levelConfig.maxTheta = tile.rotation;
                //     this.tiles.push(tile);
                // }
                let r = this.planetRadius + level.tileheight * (level.height - h - .5);
                let theta = startAngle + angleDelta * w;
                let x = this.center.x + r * Math.sin(theta);
                let y = this.center.y - r * Math.cos(theta) + groundHeight*level.tileheight;
                if(c===9 || c===10){
                    let p = this.physics.add.sprite(x, y, 'orangeman', 10 - c, {
                        isStatic: true
                    });
                    p.rotation = theta;
                    levelConfig['player' + (c - 8)] = p;
                } else {
                    let tile;
                    if([1,2,5,6].indexOf(c) === -1){
                        tile = this.physics.add.image(x, y, 'sheet', c - 1, {
                            // isStatic: true
                        });
                    } else {
                        tile = this.add.image(x, y, 'sheet', c-1);
                    }
                    tile.rotation = theta;
                    levelConfig.maxTheta = tile.rotation;
                    this.tiles.push(tile);
                }
                
            }
        }
        this.levels.push(levelConfig);
    }

    
}

export default Game;