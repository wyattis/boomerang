window.PIXI   = require('phaser-ce/build/custom/pixi');
window.p2     = require('phaser-ce/build/custom/p2');
window.Phaser = require('phaser-ce/build/custom/phaser-split');
const Menu = require('./scenes/Menu').default;
const Game = require('./scenes/Game').default;
const Phaser = window.Phaser;

window.addEventListener('load', function(){
    const game = new Phaser.Game(900, 600, Phaser.AUTO);
    game.state.add('menu', Menu);
    game.state.add('game', Game);
    game.state.start('game');
});