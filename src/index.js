import 'phaser';
import DropScreen from './scenes/DropScreen';
import Loading from './scenes/Loading';
import Game from './scenes/Game';
import Menu from './scenes/Menu';
import Overlay from './scenes/Overlay';

var config = {
    type: Phaser.WEBGL,
    backgroundColor: "#4488AA",
    width: 900,
    height: 600,
    scene: [DropScreen, Loading, Game, Overlay, Menu]
};


const game = new Phaser.Game(config);
game.scene.start('drop');