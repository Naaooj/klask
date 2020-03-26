const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const matterjs = require('matter-js');

const app = express();

const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

// Listen to connection on the socket
io.on('connection', (clientSock) => {
    console.log('Client (re)connected');
    clientSock.emit('message', 'Connected to Klask messaging');

    // Listen on client message
    clientSock.on('message', (text) => {

        // Broadcast message to all connected clients
        io.emit('message', text);
    });
});

server.on('error', (err) => {
    console.log('Server error: ', err);
});

server.listen(8080, () => {
    console.log('Klask started on 8080');
});