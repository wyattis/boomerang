/*global Phaser*/
import 'phaser';
class Loading extends Phaser.Scene{
    constructor(config={}){
        config.key = 'loading';
        super(config);
        this.levelNum = 23;
    }
    preload(){
        
        // Levels
        for(let l=1; l<=this.levelNum; l++){
            this.load.json('level'+l, `assets/levels/world1/level${l}.json`);
        }
        
        // Sprites
        this.load.image('arrow', 'assets/images/ARROW.png');
        this.load.image('boomerang', 'assets/images/Boomerarm.png');
        this.load.image('cloud', 'assets/images/cloud.png');
        this.load.spritesheet('orangeman', 'assets/images/orangeman.png', {frameWidth: 49, frameHeight: 52});
        this.load.spritesheet('sheet', 'assets/images/BoomtilesC.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('bouncer', 'assets/images/Bouncer.png', {frameWidth: 64, frameHeight: 32});
        
        // Audio
        this.load.audio('boomerinair', 'assets/audio/boomerinair4.wav');
        this.load.audio('boomerinair2', 'assets/audio/boomerinair3.wav');
        this.load.audio('bounce', 'assets/audio/bounce.wav');
        this.load.audio('crash', 'assets/audio/crash.wav');
        this.load.audio('throw', 'assets/audio/throw.wav');
        this.load.audio('collision', 'assets/audio/collision.wav');
        
        
        this.loader = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'play3');
        this.tweens.add({
            targets: this.loader,
            rotation: Math.PI * 20,
            duration: 30000
        });
    }
    create(){
        this.scene.start('game');
    }

}

export default Loading;