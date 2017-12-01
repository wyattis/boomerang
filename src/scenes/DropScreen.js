import 'phaser';
class DropScreen extends Phaser.Scene{
    constructor(config={}){
        config.key = 'drop';
        super(config);
    }
    preload(){
        this.load.image('play3', 'assets/images/Play3.png');
    }
    create(){
        this.scene.start('loading');
    }
}
export default DropScreen;