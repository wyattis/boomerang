class Menu{
    constructor(game){
        this.game = game;
    }
    preload(){
        
    }
    create(){
        this.game.state.start('game');
    }
}

export default Menu;