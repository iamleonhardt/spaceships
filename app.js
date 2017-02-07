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

function Ship(socket) {
    var self = {
        x: 100,
        y: 100,
        speed: 1,
        id: socket.id,
        shipColor: 'white'
    }
    // Update will contain all things that get updated
    self.update = function () {
        console.log('inner update fired');
        self.updatePosition();
    }
    // Updates the position
    self.updatePosition = function () {
        // self.x += self.x * self.speed;
        // self.y += self.y * self.speed;
        self.x += getRanNum(-2, 3);
        self.y += getRanNum(-2, 3);
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
            y: self.y
        }
    }

    shipList[socket.id] = self;
    initPack.ships.push(self.getInitPack());

    return self;
}

Ship.onConnect = function (socket) {
    var ship = Ship(socket);

    socket.emit('init', {
        ships: Ship.getAllInitPack(),
        bullets: {}
    })
};

Ship.getAllInitPack = function () {
    var initShips = [];
    for (var i in shipList) {
        initShips.push(shipList[i].getInitPack())
    }
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
        ship.updatePosition();
        updatePack.push(ship.getUpdatePack());
    }
    return updatePack;
}

// Socket IO
io.sockets.on('connection', function (socket) {

    socket.id = Math.random();
    socketList[socket.id] = socket;
    console.log('socket connected and socket.id is : ', socket.id);

    Ship.onConnect(socket);

    socket.on('disconnect', function () {
        delete socketList[socket.id];
        Ship.onDisconnect(socket);
    })

});

setInterval(function () {
    var updatePack = {
        ships: Ship.update()
        // bullets: Bullet.update()
    };
console.log(Object.keys(shipList));


    for (var i in socketList) {
        var socket = socketList[i];
        socket.emit('init', initPack);
        socket.emit('update', updatePack);
        socket.emit('remove', removePack);
    }
    initPack.ships = [];
    removePack.ships = [];

}, 40);
