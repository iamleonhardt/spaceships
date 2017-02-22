var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/client'));

server.listen(2000);
console.log('Grand Space Station is in orbit (server is running)');

var socketList = {};
var shipList = {};
var bulletList = {};

var initPack = {
    ships: [],
    bullets: []
};

var removePack = {
    ships: [],
    bullets: []
};

function getRanNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function Bullet(angle, x, y, parent) {
    //bullets arent firing from the center of the ship
    var self = {
        x: x,
        y: y,
        toRemove: false,
        parent: parent,
        speed: 30,
        rotation: angle,
        id: Math.random(),
        speedX: 0,
        speedY: 0
    }

    self.get_radians = function (degrees) {
        return (Math.PI / 180) * degrees;
    }

    self.get_speeds = function () {
        var temp_angle = self.rotation + 270;
        var delta_y = Math.sin(self.get_radians(temp_angle)) * self.speed;
        var delta_x = Math.cos(self.get_radians(temp_angle)) * self.speed;
        self.speedY = delta_y;
        self.speedX = delta_x
    }
    self.getDistance = function (pt) {
        return Math.sqrt(Math.pow(self.x - pt.x, 2) + Math.pow(self.y - pt.y, 2));
    }

    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            parent: self.parent
        }
    }
    self.update = function () {
        // console.log('inner update fired');
        self.updatePosition();
        for (var i in shipList) {
            var p = shipList[i]
            if (self.getDistance(p) < 45 && self.parent !== p.id) {
                //remove health or something like that
                self.toRemove = true;
            }
        }
    }

    // Updates the position
    self.updatePosition = function () {
        self.x += self.speedX;
        self.y += self.speedY;
    }

    self.get_speeds();

    setTimeout(function () {
        delete bulletList[self.id];
    }, 1000)

    return self;

}

Bullet.update = function () {
    // console.log('outer update fired');
    var updatePack = [];

    for (var i in bulletList) {
        var shot = bulletList[i];
        shot.update();
        if (shot.toRemove) {
            // removePack.bullets.push(shot.id);
            delete shot;
        } else {
            updatePack.push(shot.getUpdatePack());
        }
    }
    return updatePack;
}

function Ship(socket) {
    var self = {
        x: getRanNum(100, 500),
        y: getRanNum(100, 500),
        bullets: 30,
        speed: 1,
        acceleration: 1,
        rotation: 0,
        rotationSpeed: 15,
        id: socket.id,
        shipColor: 'white',
        maxSpeed: 25,
        pressingRight: false,
        pressingLeft: false,
        pressingUp: false,
        pressingDown: false,
        pressingAttack: false,
    }

    //used to replenish bullets
    setInterval(function () {
        self.bullet_recharge();
    }, 1000)

    self.bullet_recharge = function () {
        if (self.bullets < 30) {
            self.bullets++
        } else {
            return;
        }
    }

    self.get_radians = function (degrees) {
        return (Math.PI / 180) * degrees;
    }


    // Update will contain all things that get updated
    self.update = function () {
        // console.log('inner update fired');
        self.updatePosition();
    }

    // Updates the position
    self.updatePosition = function () {
        if (self.pressingUp) {
            self.move_ship();
        }
        if (self.pressingDown) {
            self.move_ship('back');
        }
        if (self.pressingLeft) {
            self.rotation -= self.rotationSpeed;
        }
        if (self.pressingRight) {
            self.rotation += self.rotationSpeed;
        }
        if (self.pressingAttack) {
            self.shoot_bullet();
        }
        if (!self.pressingUp && !self.pressingDown){
            self.acceleration > 2 ? self.acceleration -= 2 : self.acceleration = 0;
        }
    }

    //i used some of dans crazy movement ideas
    self.shoot_bullet = function () {
        if (self.bullets) {
            var b = new Bullet(self.rotation, self.x, self.y, self.id);
            console.log(b.id)
            bulletList[b.id] = b;
            self.bullets--;
        }
    }
    //this needs a touch up
    self.get_speed = function () {
        if(self.speed + self.acceleration + 1 <= self.maxSpeed){
            return self.speed + ++self.acceleration
        }else{
            return self.maxSpeed
        }
        // return self.speed + ++self.acceleration <= self.maxSpeed ? self.speed + ++self.acceleration : self.maxSpeed;
    }
    self.move_ship = function (back) {
        var temp_angle = self.rotation + 270;
        var speed = self.get_speed();
        var delta_x = Math.cos(self.get_radians(temp_angle)) * speed;
        var delta_y = Math.sin(self.get_radians(temp_angle)) * speed;
        if (back) {
            self.x -= delta_x;
            self.y -= delta_y;
        } else {
            self.x += delta_x;
            self.y += delta_y;
        }
    }

    // Gets all of the game data to send when a new player joins
    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            bullets: self.bullets,
            shipColor: self.shipColor
        }
    }

    // Eventually this should check if theres a difference and only send if theres a difference
    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            bullets: self.bullets,
            rotation: self.rotation
        }
    }

    shipList[socket.id] = self;
    initPack.ships.push(self.getInitPack());

    return self;
}

Ship.onConnect = function (socket) {
    var ship = Ship(socket);

    initPack = {
        ships: Ship.getAllInitPack(),
        bullets: {}
    }

};

Ship.getAllInitPack = function () {
    var initShips = [];
    for (var i in shipList) {
        initShips.push(shipList[i].getInitPack())
    }
    console.log('initShips is : ', initShips);
    return initShips;
}

Ship.onDisconnect = function (socket) {
    delete shipList[socket.id];
    removePack.ships.push(socket.id);
};

Ship.update = function () {
    // console.log('outer update fired');
    var updatePack = [];

    for (var i in shipList) {
        var ship = shipList[i];
        ship.update();
        updatePack.push(ship.getUpdatePack());
    }
    return updatePack;
}

// Socket IO
io.sockets.on('connection', function (socket) {
    socket.id = Math.random();
    socketList[socket.id] = socket;
    Ship.onConnect(socket);

    socket.on('askForId', function(){
        socket.emit('answerForId', {id:socket.id});
    })

    // Keypress event used to handle movement and keypresses
    socket.on('keyPress', function (data) {
        if (data.inputId === 'up') {
            shipList[socket.id].pressingUp = data.state;
        }
        else if (data.inputId === 'down') {
            shipList[socket.id].pressingDown = data.state;
        }
        else if (data.inputId === 'left') {
            shipList[socket.id].pressingLeft = data.state;
        }
        else if (data.inputId === 'right') {
            shipList[socket.id].pressingRight = data.state;
        }
        else if (data.inputId === 'space') {
            shipList[socket.id].pressingAttack = data.state;
        }
    })

    socket.on('disconnect', function () {
        delete socketList[socket.id];
        Ship.onDisconnect(socket);
    })
});


// Heartbeat - currently 25 fps
setInterval(function () {
    var updatePack = {
        ships: Ship.update(),
        bullets: Bullet.update()
    };

    // console.log(Object.keys(shipList));

    for (var i in socketList) {
        var socket = socketList[i];
        socket.emit('remove', removePack);
        socket.emit('init', initPack);
        socket.emit('update', updatePack);
    }

    initPack.ships = [];
    removePack.ships = [];

}, 40);
