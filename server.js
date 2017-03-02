var express = require('express');
var http = require('http');
var socket = require('socket.io');
var app = express();
app.use('/', express.static(__dirname + '\\view'));
var server = http.createServer(app);
server.listen(8888);
var io = socket.listen(server);
var nicknames = [];
io.on('connection', function(socket){
    socket.on('signin', function(data){
        if(nicknames.indexOf(decodeURIComponent(data))!==-1){
            socket.emit('nickname_repeat');
        }else{
            nicknames.push(data);
            socket.emit('signin_success', encodeURIComponent(data));
        }
    });
    socket.on('send', function(data){
        io.sockets.emit('recieve', data);
    });
    socket.on('send_img', function(data){
        io.sockets.emit('recieve_img', data);
    });
    
});


