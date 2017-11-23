import * as Phaser from 'phaser-ce';

class Game{
    preload(){
        this.game.load.image('circle', 'assets/circle.png');
        this.game.load.image('boomerang', 'assets/boomerang.png');
    }
    create(){
        this.gravity = 180;
        this.game.stage.backgroundColor = "#4488AA";
        this.game.world.setBounds(0, 0, 1920, 1920);
        this.world = this.game.add.group();
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        this.player = this.game.add.sprite(100, 500, 'circle');
        this.player.anchor.set(.5, .5);
        // this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
        // this.player.body.setCircle(32);

        
        this.player2 = this.game.add.sprite(800, 500, 'circle');
        this.game.physics.enable(this.player2, Phaser.Physics.ARCADE);
        this.player2.anchor.set(.5, .5);
        this.player2.body.setCircle(32);
        this.player2.body.immovable = true;

        
        this.boomerang = this.game.add.sprite(400, 200, 'boomerang');
        this.game.physics.enable(this.boomerang, Phaser.Physics.ARCADE);
        this.boomerang.anchor.set(.5);
        this.boomerang.body.gravity.set(0, 180);
        this.boomerang.visible = false;
        this.boomerang.alive = false;
        this.boomerang.body.onCollide = new Phaser.Signal();
        this.boomerang.body.onCollide.add(this.boomerangCollision.bind(this), this);
        // this.boomerang.body.immovable=true;
        
        
        // this.planet = this.game.add.sprite(400, 1000, 'circle');
        let planetRad = 3500;
        this.planet = this.game.add.graphics(this.game.width / 2, this.game.height - 100 + planetRad / 2);
        this.planet.beginFill(0xFFFF00, 1);
        this.planet.drawCircle(0, 0, planetRad);
        this.game.physics.enable(this.planet, Phaser.Physics.ARCADE);
        // this.planet.body.setCircle(planetRad/2);
        this.planet.body.immovable = true;
        this.planet.anchor.set(.5, .5);
        // this.planet.scale.x = 20;
        // this.planet.scale.y = 20;
        
        this.game.input.mouse.capture = true;
        this.isDrawing = false;
        this.canDraw = true;
        this.throwCount = 0;
    }
    update(){
        
        this.rotatePlanet();
        this.captureThrow();
        
        // if(this.boomerang.alive){
            this.game.physics.arcade.collide(this.boomerang, this.planet);
            this.game.physics.arcade.collide(this.boomerang, this.player2);
        // }

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
    
    captureThrow(){
        
        if(this.canDraw && !this.isDrawing && this.game.input.activePointer.leftButton.isDown){
            this.isDrawing = true;
            this.start = {x: this.game.input.x, y: this.game.input.y};
        } else if(this.isDrawing && this.game.input.activePointer.leftButton.isUp){
            this.end = {x: this.game.input.x, y: this.game.input.y};
            this.isDrawing = false;
            this.throw({x:this.end.x - this.start.x, y:this.end.y-this.start.y});
        }
        
    }
    
    rotatePlanet(){
        let planetSpeed = .01;
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.planet.rotation += planetSpeed;
        } else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.planet.rotation -= planetSpeed;
        }
        
        // this.player.body.velocity.y = 0;
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
            this.player.body.velocity.y = -100;
        }
    }
    
    throw(vel){
        this.boomerang.visible = true;
        this.boomerang.alive = true;
        this.boomerang.x = this.player.x;
        this.boomerang.y = this.player.y;
        this.boomerang.body.velocity.set(vel.x, vel.y);
        this.throwCount ++;
        console.log("Throw!");
    }
    
    
    next(){
        this.boomerang.alive = false;
        this.boomerang.visible = false;
    }
    
    render(){
        //  this.game.debug.spriteInfo(this.player, 32, 32);
        //  this.game.debug.spriteInfo(this.planet, 400, 32);
        this.game.debug.spriteInfo(this.boomerang, 32, 32);
    }
}

export default Game;