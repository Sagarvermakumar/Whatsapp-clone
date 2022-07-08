
//require module
const express = require('express');
const { del } = require('express/lib/application');
const app = express();
const http = require('http');
const path = require('path');
const { disconnect } = require('process');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {};
const port = 8000;

//serve public folder
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir))


io.on('connection', (socket) => {

  //if user connect the server
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    console.log(name, "joined");
    socket.broadcast.emit('user-joined', name);
  });

  //if user send the message
  socket.on('send', message => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
  });

  // if user disconnected
  socket.on('disconnect', message => {
    socket.broadcast.emit('left', users[socket.id]);
    delete users[socket.id];
  });
});

//listening server
server.listen(port, () => {
  console.log(`server is runing  on : http://localhost:${port}`);
});