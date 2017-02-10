function Ship(initPack){
    var self = this;
    this.id = initPack.id;
    this.pilotName = initPack.pilotName;

    this.width = 30;
    this.height = 30;
    this.domElem = null;


    // location and movement properties
    this.x = initPack.x;
    this.y = initPack.y;
    this.xTraj = 0;
    this.yTraj = 0;
    this.speed = initPack.speed;
    this.rotation = 0;
    this.acceleration = 1;
    this.rotationSpeed = 15;
    this.maxSpeed = 20;
    this.rotationSpeed = 15;

    this.tempX = self.x;
    this.tempY = self.y;
    this.tempRot = self.rotation;

    //i used some of dans crazy movement ideas
	this.get_radians = function(degrees){
		return (Math.PI/180) * degrees;
	}
    //this get speed function needs a little redoing
    this.get_speed = function(){
        return self.speed + ++self.acceleration <= self.maxSpeed ? self.speed + ++self.acceleration : self.maxSpeed; 
    }
	this.move_ship = function(){
		var temp_angle = self.rotation + 270;
        var speed = self.get_speed();
		var delta_x = Math.cos(self.get_radians(temp_angle)) * speed;
		var delta_y = Math.sin(self.get_radians(temp_angle)) * speed;
        self.tempX += delta_x;
        self.tempY += delta_y;
        socket.emit('moveShip', {x:self.tempX, y:self.tempY, rotation:self.tempRot});	
	}

    this.rotateRight = function(){
        self.tempRot -= self.rotationSpeed;
        socket.emit('moveShip', {x:self.tempX, y:self.tempY, rotation:self.tempRot});
    }

    this.rotateRight = function(){
        self.tempRot += self.rotationSpeed;
        socket.emit('moveShip', {x:self.tempX, y:self.tempY, rotation:self.tempRot});
    }

    this.createDomElem = function(){
        this.domElem = $('<div>', {
            id: this.id,
            class: 'ship',
            css: {
                left: self.x,
                top: self.y,
                'transition-duration': 0.1+'s',
                // 'background-color': initPack.shipColor,
                // width: self.width + 'px',
                // height: self.height + 'px',
                text: this.pilotName
            }
        });
        return this.domElem;
    };

    this.shipDie = function(){
        console.log('destroying ship... kapow');
        $(this.domElem).remove();

    }
}