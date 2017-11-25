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
        
        this.planetRadius = 3500;
        this.gravity = 180;
        this.physics.world.setBounds(0, 0, this.planetRadius*2 + this.game.config.height, this.planetRadius*2 + this.game.config.width);
        this.center = {x: this.physics.world.bounds.width / 2, y: this.physics.world.bounds.height / 2};

        this.boomerang = this.physics.add.sprite(400, 200, 'boomerang');
        this.boomerang.setVisible(false);
        this.boomerang.setActive(false);

        
        
        this.arrow = new Arrow(this, 0, 0);
        
        
        // this.planet = this.game.add.sprite(400, 1000, 'circle');
        let planetGraphics =  this.make.graphics({x: 0, y: 0, add: false});
        // planetGraphics.lineStyle(1, 0xff0000, 1.0);
        planetGraphics.fillStyle(0x60bd37, 1.0);
        planetGraphics.fillCircle(this.planetRadius, this.planetRadius, this.planetRadius);
        planetGraphics.generateTexture('planet', this.planetRadius*2, this.planetRadius*2);
        this.planet = this.physics.add.staticImage(this.center.x, this.center.y, 'planet');
        this.planet.setCircle(this.planetRadius);

        
        this.physics.add.collider(this.boomerang, this.planet);
        this.physics.add.collider(this.boomerang, this.player2);
        
        this.input.events.on('POINTER_DOWN_EVENT', this.pointerDown.bind(this));
        this.input.events.on('POINTER_MOVE_EVENT', this.pointerMove.bind(this));
        this.input.events.on('POINTER_UP_EVENT', this.pointerUp.bind(this));
        
        console.log(this.cameras.main);
        this.centerOnPoint(this.center, 1000, .07, () => {this.scene.launch('menu')});
        this.makeClouds(100, -200, 300);
        this.level = 0;
        this.createLevels();
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
        console.log('down', event, event.x, event.y);
        if(event.gameObject){
            debugger;
        }
    }
    
    pointerMove(event){
        
    }
    pointerUp(event){
        
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
    
    zoomToLevel( duration=1500){
        let lev = this.levels[this.level];
        let middleTheta = (lev.minTheta + lev.maxTheta) /2;
        let center = {x: this.center.x + this.planetRadius * Math.sin(middleTheta), y: this.center.y - this.planetRadius * Math.cos(middleTheta) };

        this.tweens.add({
            targets: this.cameras.main,
            props: {
                scrollX:  center.x - this.cameras.main.width * 0.5,
                scrollY:  center.y - this.cameras.main.width * 0.5,
                rotation: middleTheta - 1,
                zoom: 1
            },
            duration: duration,
            ease: 'Cubic.easeInOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.cameras.main,
                    props: {
                        rotation: middleTheta,
                        zoom: .9
                    },
                    duration: duration,
                    ease: 'Cubic.easeInOut',
                    onComplete: this.startLevel.bind(this)
                });
            }
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
        let i = this.clouds.length;
        while(i--){
            this.clouds[i].setRotation(this.clouds[i].rotation + this.clouds[i].omega);
        }

    }
    
    boomerangCollision(spriteA, spriteB){
        
        if((spriteA === this.boomerang && spriteB === this.player2) || (spriteB===this.boomerang && spriteA===this.player2)){
            console.log('Winner!');
            this.next();
        } else{
            this.boomerang.alive = false;
            this.boomerang.visible = false;
        }
        
    }
    

    throw(vel){
        this.boomerang.setVisible(true);
        this.boomerang.setActive(true);
        this.boomerang.x = this.player.x;
        this.boomerang.y = this.player.y;
        this.boomerang.body.velocity.set(vel.x, vel.y);
        this.throwCount ++;
        console.log("Throw!");
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
        let stopAngle = 0;
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
                if(c === 9){
                    let p = this.add.sprite(this.center.x, this.center.y, 'orangeman', 1);
                    p.setOrigin(.5, (p.height * (level.height - h) + this.planetRadius) / p.height - groundHeight - 1);
                    p.rotation = startAngle + angleDelta*w;
                    levelConfig.player1 = p;
                }
                else if(c===10){
                    let p = this.add.sprite(this.center.x, this.center.y, 'orangeman', 0);
                    p.setOrigin(.5, (p.height * (level.height - h) + this.planetRadius) / p.height - groundHeight - 1);
                    p.rotation = startAngle + angleDelta*w;
                    levelConfig.player2 = p;
                } else {
                    let tile = this.add.image(this.center.x, this.center.y, 'sheet', c - 1);
                    tile.setOrigin(.5, (tile.height * (level.height - h) + this.planetRadius) / tile.height - groundHeight);
                    tile.rotation = startAngle + angleDelta*w;
                    levelConfig.maxTheta = tile.rotation;
                    this.tiles.push(tile);
                }
            }
        }
        this.levels.push(levelConfig);
    }

    
}

export default Game;