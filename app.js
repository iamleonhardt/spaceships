var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/client'));

server.listen(2000);
console.log('Grand Space Station is in orbit (server is running)');

// Socket IO
var socketList = [
    {id:123, pilotName: 'Dan', shipColor: 'red', x:20, y:10},
    {id:221, pilotName: 'Stan', shipColor: 'blue', x:30, y:55}
];

io.sockets.on('connection', function(socket){
    console.log('socket connection');

    socket.emit('initializeShip', {
        msg: 'socket connected, passing pack of all ships',
        ships: [
            {id:123, pilotName: 'Dan', shipColor: 'red', x:20, y:10},
            {id:221, pilotName: 'Stan', shipColor: 'blue', x:30, y:55}
            ],
        bullets: []
    });
    // socket.id = Math.random();
    // socketList[socket.id] = socket;
    // socket.x = 0;
    // socket.y = 0;


    socket.emit('update', {
        ships: [
            {id:123, pilotName: 'Dan', shipColor: 'red', x:55, y:210},
            {id:221, pilotName: 'Stan', shipColor: 'blue', x:205, y:610}
        ],
        bullets: []
    });

    socket.on('indexReady', function(data){
        console.log(data.msg);
    });



});


function getRanNum(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

// setInterval(function(){
//     var pack = [];
//     for (var i in socketList){
//         var socket = socketList[i];
//         socket.x += getRanNum(-2, 2);
//         socket.y += getRanNum(-2, 2);
//         pack.push({
//             x:socket.x,
//             y: socket.y
//         });
//     }
//     for (var i in socketList){
//         var socket = socketList[i];
//         socket.emit('update', pack);
//     }
//
// }, 40);