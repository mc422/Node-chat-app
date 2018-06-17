const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room name are required');
    }

    // send socket event to specific namespace
    // io.emit -> io.to('Room').emit()
    // socket.broadcast.to('Room').emit()

    // allows you to “namespace” your sockets
    socket.join(params.room);

    // send event to the socket connection client
    socket.emit(
      'newMessage',
      generateMessage('Admin', 'Welcome to the chat room!')
    );

    // broadcase event to every listener under special 'room'
    socket.broadcast.to(params.room).emit(
      'newMessage',
      generateMessage('Admin', `${params.name} joins the chat room!`)
    );

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('create message', message);

    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
