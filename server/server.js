const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // send event to the socket connection client
  socket.emit(
    'newMessage',
    generateMessage('admin', 'Welcome to the chat room!')
  );

  // broadcase event to every listener by itself
  socket.broadcast.emit(
    'newMessage',
    generateMessage('user123', 'User123 joins the chat room!')
  );

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
