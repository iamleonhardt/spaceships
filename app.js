var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/client'));

server.listen(2000);
console.log('Grand Space Station is in orbit (server is running)');

var socketList = {};
var shipList = {};

var initPack = {
    ships: {},
    bullets: {}
};

var removePack = {
    ships: {},
    bullets: {}
};

function getRanNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function Ship(socket) {
    var self = {
        x: getRanNum(100, 500),
        y: getRanNum(100, 500),
        speed: 1,
        // acceleration: 1,
        rotation: 0,
        // rotationSpeed: 15,
        id: socket.id,
        shipColor: 'white'

    }

    // Update will contain all things that get updated
    self.update = function () {
        console.log('inner update fired');
        self.updatePosition();
    }

    // Updates the position
    self.updatePosition = function (data) {
        var filtered = [];
        if (data) {
            //when theres data it filters the keys that are true then applies the correct movement
            var keys = Object.keys(data);
            filtered = keys.filter(function (key) {
                return data[key];
            });
        }
        filtered = filtered.join('');
        // console.log(filtered);

        //this switch is kind of fat any ideas on a better way around this?
        switch (filtered) {
            case 'wad':
                self.move_ship();
                break;
            case 'sad':
                break;
            case 'wd':
                self.move_ship();
                self.rotation += self.rotationSpeed;
                break;
            case 'wa':
                self.move_ship();
                self.rotation -= self.rotationSpeed;
                break;
            case 'sa':
                // self.y += self.speed + ++self.acceleration;
                self.rotation -= self.rotationSpeed;
                break;
            case 'sd':
                // self.y += self.speed + ++self.acceleration;
                self.rotation += self.rotationSpeed;
                break;
            case 'w':
                self.move_ship();
                break;
            case 's':
                // self.y += self.speed + ++self.acceleration;
                break;
            case 'a':
                self.rotation -= self.rotationSpeed;
                break;
            case 'd':
                self.rotation += self.rotationSpeed;
                break;
            default:
                // self.acceleration = 1;
                // self.speed = 1;
                break;
        }
    }

    //i used some of dans crazy movement ideas
    self.get_radians = function (degrees) {
        return (Math.PI / 180) * degrees;
    }
    //this get speed function needs a little redoing
    self.get_speed = function () {
        return self.speed + ++self.acceleration <= self.maxSpeed ? self.speed + ++self.acceleration : self.maxSpeed;
    }
    self.move_ship = function () {
        var temp_angle = self.rotation + 270;
        var speed = self.get_speed();
        var delta_x = Math.cos(self.get_radians(temp_angle)) * speed;
        var delta_y = Math.sin(self.get_radians(temp_angle)) * speed;
        self.x += delta_x;
        self.y += delta_y;
    }

    // Gets all of the game data to send when a new player joins
    self.getInitPack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
            shipColor: self.shipColor
        }
    }

    // Eventually this should check if theres a difference and only send if theres a difference
    self.getUpdatePack = function () {
        return {
            id: self.id,
            x: self.x,
            y: self.y,
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

Ship.update = function (id, data) {
    // console.log('outer update fired');
    var updatePack = [];

    for (var i in shipList) {
        var ship = shipList[i];
        //when update contains the id and keydata, it updatesPosition for that specific ship
        if (ship == shipList[id]) {
            console.log('moving');
            shipList[id].updatePosition(data);
        } else {
            ship.updatePosition();
        }
        updatePack.push(ship.getUpdatePack());
    }
    return updatePack;
}

// Socket IO
io.sockets.on('connection', function (socket) {

    socket.id = Math.random();
    socketList[socket.id] = socket;
    // console.log('socket connected and socket.id is : ', socket.id);

    Ship.onConnect(socket);

    // move ship event uses the Ship.update method
    socket.on('moveShip', function (data) {
        Ship.update(socket.id, data)
    })

    socket.on('disconnect', function () {
        delete socketList[socket.id];
        Ship.onDisconnect(socket);
    })

});


// Heartbeat - currently 25 fps
setInterval(function () {
    var updatePack = {
        ships: Ship.update()
        // bullets: Bullet.update()
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
