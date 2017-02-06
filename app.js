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
    ships:[],
    bullets:[]
};

var removePack = {
    ships:[],
    bullets:[]
};

//
// {id:123, pilotName: 'Dan', shipColor: 'red', x:20, y:10},
// {id:221, pilotName: 'Stan', shipColor: 'blue', x:30, y:55}

function getRanNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function Ship(socket){
    var self = {
        x:100,
        y:100,
        speed: 1,
        id: socket.id,
        shipColor: 'white'
    }
    // Update will contain all things that get updated
    self.update = function(){
        console.log('inner update fired');
        self.updatePosition();
    }
    // Updates the position
    self.updatePosition = function(){
        // self.x += self.x * self.speed;
        // self.y += self.y * self.speed;
        self.x += getRanNum(-2, 3);
        self.y += getRanNum(-2, 3);
    }

    shipList[socket.id] = self;

    initPack.ships.push({
        id:self.id,
        x:self.x,
        y:self.y,
        shipColor:self.shipColor
    });

    return self;
}

Ship.onConnect = function(socket){
    var ship = Ship(socket);
};

Ship.onDisconnect = function(socket){
    delete shipList[socket.id];
    removePack.ships.push(socket.id);
};

Ship.update = function(){
    // console.log('outer update fired');
    var updatePack = [];

    for (var i in shipList){
        var ship = shipList[i];
        ship.updatePosition();
        updatePack.push({
            id: ship.id,
            x:ship.x,
            y: ship.y
        });
    }
    return updatePack;
}

// Socket IO
io.sockets.on('connection', function(socket){

    socket.id = Math.random();
    socketList[socket.id] = socket;
    console.log('socket connected and socket.id is : ', socket.id);

    Ship.onConnect(socket);

    socket.on('disconnect', function(){
        delete socketList[socket.id];
        Ship.onDisconnect(socket);
    })
    // socket.emit('initializeShip', {
    //     msg: 'socket connected, passing pack of all ships',
    //     ships: [
    //         {id:123, pilotName: 'Dan', shipColor: 'red', x:20, y:10},
    //         {id:221, pilotName: 'Stan', shipColor: 'blue', x:30, y:55}
    //         ],
    //     bullets: []
    // });

    // socket.x = 0;
    // socket.y = 0;

    // socket.emit('update', {
    //     ships: [
    //         {id:123, pilotName: 'Dan', shipColor: 'red', x:55, y:210},
    //         {id:221, pilotName: 'Stan', shipColor: 'blue', x:205, y:610}
    //     ],
    //     bullets: []
    // });

});

setInterval(function(){
    var updatePack = {
        ships: Ship.update()
        // bullets: Bullet.update()
    };

    for (var i in socketList){
        var socket = socketList[i];
        socket.emit('init', initPack);
        socket.emit('update', updatePack);
        socket.emit('remove', removePack);
    }
    initPack.ships = [];
    removePack.ships = [];

}, 40);
