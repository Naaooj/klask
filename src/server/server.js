const express = require('express');
const socketio = require('socket.io');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const webpackConfig = require('../../webpack.dev.js');

// Creates the express server
const app = express();
app.use(express.static(`${__dirname}/../client`));

// Setup Webpack for development
if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler));
    
    // Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
} else {
    // Static serve the dist/ folder in production
    app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    console.log('Klask started on 8080');
});
console.log(`Server listening on port ${port}`);

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
