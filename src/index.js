import 'phaser';
import Game from './scenes/Game';
import Menu from './scenes/Menu';
import Overlay from './scenes/Overlay';

var config = {
    type: Phaser.WEBGL,
    backgroundColor: "#4488AA",
    width: 900,
    height: 600,
    scene: [Game, Overlay, Menu],
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: true,
            debug: true,
            gravity: {
                x: 0,
                y: 0
            },
            plugins: {
                attractors: true
            }
        }
    }
};


const game = new Phaser.Game(config);
game.scene.start('game');