var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use('/', express.static(__dirname + '/client'));

server.listen(2000);
console.log('Grand Space Station is in orbit (server is running)');

// Socket IO
var socketList = {};

io.sockets.on('connection', function(socket){
    console.log('socket connection');
    socket.id = Math.random();
    socketList[socket.id] = socket;
    socket.x = 0;
    socket.y = 0;


    socket.on('indexReady', function(data){
        console.log(data.msg);
    });


    socket.emit('serverMsg', {
        msg: 'The stars at night are big and bright..'
    })

});


setInterval(function(){
    var pack = [];
    for (var i in socketList){
        var socket = socketList[i];
        socket.x++;
        socket.y++;
        pack.push({
            x:socket.x,
            y: socket.y
        });
    }
    for (var i in socketList){
        var socket = socketList[i];
        socket.emit('newPositions', pack);
    }

}, 40);