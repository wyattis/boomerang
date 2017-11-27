class PolarRect{
    constructor(left, bottom, width, height){
        this.left = left;
        this.bottom = bottom;
        this.theta = left;
        this.r = bottom;
        this.width = width;
        this.height = height;
        this.top = bottom + height;
        this.right = left + width;
    }
    
    intersects(r){
        return !(this.left > r.right ||
            this.right < r.left ||
            this.top > r.bottom ||
            this.bottom < r.top);
    }
}