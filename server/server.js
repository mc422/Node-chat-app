const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  // send event to the socket connection client
  socket.emit('newMessage', {
    text: 'Welcome to the chat room!'
  });

  // broadcase event to every listener by itself
  socket.broadcast.emit('newMessage', {
    from: 'user123',
    text: 'User123 joins the chat room!',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log('create message', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
