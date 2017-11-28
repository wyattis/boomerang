import 'phaser';

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

export default Overlay;