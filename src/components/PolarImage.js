import 'phaser';

class PolarSprite extends Phaser.GameObjects.Sprite{
    constructor(game, theta, r, cacheKey, frame, config){
        super(game, 0, 0, cacheKey, frame, config);
        this._r = r;
        this._theta = theta;
        this._center = game.center || {x:0, y:0};
        this.lockRotation = true;
        this.updatePosition(theta, r);
    }
    
    updatePosition(theta, r){
        this.r = r;
        this.theta = theta;
    }
    
    get left(){
        return this._left;
    }
    
    get right(){
        return this._right;
    }
    
    get top(){
        return this._top;
    }
    
    get bottom(){
        return this._bottom;
    }
    
    set center(c){
        this._center = c;
    }
    
    get center(){
        return this._center;
    }
    
    set r(r){
        this._r = r;
        this._bottom = r - this.height * this.originY;
        this._top = r + this.height * this.originY;
        this.updateCartesian();
    }
    
    set theta(theta){
        if(theta > 2*Math.PI){
            // debugger;
            this._theta = theta - 2 * Math.PI;
        } else if(theta < 0){
            // debugger;
            this._theta = 2*Math.PI - theta;
        } else {
            this._theta = theta;
        }
        this._left = this._theta - (this.width * this.originX) / this.r;
        this._right = this._theta + (this.width * this.originX) / this.r;
        if(this.lockRotation){
            this.setRotation(this._theta);
        }
        this.updateCartesian();
    }
    
    updateCartesian(){
        this.x = this._center.x + this._r * Math.sin(this._theta);
        this.y = this._center.y - this._r * Math.cos(this._theta);
    }
    
    get r(){
        return this._r;
    }
    
    get theta(){
        return this._theta;
    }
    
}


export default PolarSprite;