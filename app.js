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
        acceleration: 1,
        rotation: 0 ,
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
        var filtered;
        if(data){
            //when theres data it filters the keys that are true then applies the correct movement
            var keys = Object.keys(data);
            filtered = keys.filter(function(key) {
                return data[key];
            });
        }
            filtered = filtered.join('');
            console.log(filtered);

            //this switch is kind of fat any ideas on a better way around this?
            switch(filtered){
                case 'wd':
                    self.y -= self.speed + ++self.acceleration;
                    self.x += self.speed + ++self.acceleration;
                    break;
                case 'wa':
                    self.y -= self.speed + ++self.acceleration;
                    self.x -= self.speed + ++self.acceleration;
                    break;
                case 'sa':
                    self.y += self.speed + ++self.acceleration;
                    self.x -= self.speed + ++self.acceleration;
                    break;
                case 'sd':
                    self.y += self.speed + ++self.acceleration;
                    self.x += self.speed + ++self.acceleration;
                    break;
                case 'w':
                    self.y -= self.speed + ++self.acceleration;
                    break;
                case 's':
                    self.y += self.speed + ++self.acceleration;
                    break;
                case 'a':
                    self.x -= self.speed + ++self.acceleration;
                    break;
                case 'd':
                    self.x += self.speed + ++self.acceleration;
                    break;
                default:
                    self.acceleration = 1;
                    break;
            }
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
        if(id && data){
            shipList[id].updatePosition(data);
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
    socket.on('moveShip', function(data){
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
