import 'phaser';

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

export default Menu;