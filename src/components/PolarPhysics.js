class PolarPhysics{
    constructor(scene){
        this.scene = scene;
        this.bodies = [];
        this.isPaused = true;
        this.thetaTol = .00001;
        this.rTol = .01;
        this.angularTol = .001;
        this.gravity = {
            _theta: 0,
            _r: 0,
            set theta(theta){
                this._theta = theta;
            },
            get theta(){
                return this._theta;
            },
            set r(r){
                this._r = r;
            },
            get r(){
                return this._r;
            }
        };
        this.bounds = {
            rMin: 0,
            rMax: 10000
        };
    }
    setBounds(rMin, rMax){
        this.bounds.rMin = rMin;
        this.bounds.rMax = rMax;
    }
    add(obj){
        obj.elasticity = {
            theta: .2,
            r: .2,
            angular: 0
        };
        obj.velocity = {
            theta: 0,
            r: 0,
            angular: 0
        };
        obj.acceleration = {
            theta: 0,
            r: 0,
            angular: 0
        };
        obj.friction = {
            theta: 0,
            r: 0,
            angular: 0
        };

        obj.lockRotation = true;
        obj.isStatic = false;
        obj.useGravity = false;
        this.bodies.push(obj);
        return obj;
    }
    pause(){
        this.isPaused = true;
    }
    unpause(){
        this.isPaused = false;
    }
    setElasticity(obj, val=1){
        obj.elasticity = val;
    }
    setGravity(obj, val=true){
        obj.useGravity = val;
    }
    setStatic(obj, val=true){
        if(val){
            obj.useGravity = false;
        }
        obj.isStatic = val;
    }
    update(time, delta){
        
        if(this.isPaused) {
            return;
        }
        
        let i = this.bodies.length;
        while(i--){
            // Radius
            // if(this.bodies[i].isStatic){
            //     return;
            // }
            
            if(this.bodies[i].useGravity){
                this.bodies[i].velocity.r += this.gravity.r;
            }
            this.bodies[i].velocity.r += this.bodies[i].acceleration.r;
            if(this.bodies[i].velocity.r > this.rTol){
                this.bodies[i].velocity.r -= this.bodies[i].friction.r;
            } else if(this.bodies[i].velocity.r < -this.rTol){
                this.bodies[i].velocity.r += this.bodies[i].friction.r;
            } else{
                this.bodies[i].velocity.r = 0;
            }
            this.bodies[i].r += this.bodies[i].velocity.r;
            this.radiusCollision(i);
            
           
            
            // Theta
            this.bodies[i].hasCollided = false;
            if(this.bodies[i].useGravity){
                this.bodies[i].velocity.theta += this.gravity.theta;
            }
            this.bodies[i].velocity.theta += this.bodies[i].acceleration.theta;
            if(this.bodies[i].velocity.theta > this.thetaTol){
                this.bodies[i].velocity.theta -= this.bodies[i].friction.theta;
            } else if(this.bodies[i].velocity.theta < -this.thetaTol){
                this.bodies[i].velocity.theta += this.bodies[i].friction.theta;
            } else{
                this.bodies[i].velocity.theta = 0;
            }
            this.bodies[i].theta += this.bodies[i].velocity.theta;
            this.thetaCollision(i);
            
            
            // Boundary collision
            if(this.bodies[i].top > this.bounds.rMax){
                this.bodies[i].r = this.bounds.rMax - this.bodies[i].height * this.bodies[i].originY;
                this.bodies[i].velocity.r = 0;
            } else if(this.bodies[i].bottom < this.bounds.rMin){
                this.bodies[i].r = this.bounds.rMin + this.bodies[i].height * this.bodies[i].originY;
                this.bodies[i].velocity.r = 0;
                this.bodies[i].velocity.angular *= .9;
            }
            
            
            // Rotation
            if(!this.bodies[i].lockRotation){
                this.bodies[i].velocity.angular += this.bodies[i].acceleration.angular;
                if(this.bodies[i].velocity.angular > this.angularTol){
                    this.bodies[i].velocity.angular -= this.bodies[i].friction.angular;
                } else if(this.bodies[i].velocity.angular < -this.angularTol){
                    this.bodies[i].velocity.angular += this.bodies[i].friction.angular;
                } else{
                    this.bodies[i].velocity.angular = 0;
                }
                this.bodies[i].rotation += this.bodies[i].velocity.angular;
            }
            
        }
        // this.collisionCheck();
    }
    
    intersects(a, b){
        return !( a.left > b.right
        || a.right < b.left
        || a.top < b.bottom
        || a.bottom > b.top);
    }
    
    thetaCollision(i){
        let j = this.bodies.length;
        while(j--){
            if(i !== j ){
                let a = this.bodies[i];
                let b = this.bodies[j];
                // console.log(a.isStatic, b.isStatic);
                if(!a.hasCollided && !b.hasCollided && !((a.isStatic && b.isStatic ) || (!a.isStatic && !b.isStatic))){
                    // if(a.velocity.theta > 0)
                    //     console.log(a.left, a.right, a.top, a.bottom);
                    if(this.intersects(a, b)){
                        a.hasCollided = true;
                        if(a.onCollision){
                            a.onCollision(b);
                        }
                        if(b.onCollision){
                            b.onCollision(a);
                        }
                        if(b.isStatic){
                            a.theta -= a.velocity.theta;
                            a.velocity.theta *= -b.elasticity.theta;
                        } else {
                            // debugger;
                            b.theta -= b.velocity.theta;
                            b.velocity.theta *= -a.elasticity.theta;
                        }
                    }
                }
            }
        }
    }
    
    radiusCollision(i){
        let j = this.bodies.length;
        while(j--){
            if(i !== j ){
                let a = this.bodies[i];
                let b = this.bodies[j];
                if(!a.hasCollided && !b.hasCollided && !((a.isStatic && b.isStatic ) || (!a.isStatic && !b.isStatic))){
                    if(this.intersects(a, b)){
                        a.hasCollided = true;
                        if(b.isStatic){
                            a.r -= a.velocity.r;
                            a.velocity.r *= -b.elasticity.r;
                        } else {
                            b.r -= b.velocity.r;
                            b.velocity.r *= -a.elasticity.r;
                        }
                    }
                }
            }
        }
    }
    
    collisionCheck(){
        let i = this.bodies.length;
        while(i--){
            let j = this.bodies.length;
            while(j--){
                if(i !== j ){
                    let a = this.bodies[i];
                    let b = this.bodies[j];
                    // console.log(a.isStatic, b.isStatic);
                    if(!a.hasCollided && !b.hasCollided && !((a.isStatic && b.isStatic ) || (!a.isStatic && !b.isStatic))){
                        // if(a.velocity.theta > 0)
                        //     console.log(a.left, a.right, a.top, a.bottom);
                        if(this.intersects(a, b)){
                            a.hasCollided = true;
                            if(b.isStatic){
                                a.velocity.theta *= -1;
                                a.theta += a.velocity.theta;
                            } else {
                                // debugger;
                                b.velocity.theta *= -1;
                                b.theta += b.velocity.theta;
                            }
                        }
                    }
                }
            }
            // debugger;
        }
    }
}

export default PolarPhysics;