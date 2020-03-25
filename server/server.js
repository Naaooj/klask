const http = require('http');
const express = require('express');

const app = express();

const clientPath = `${__dirname}/../client`;

app.use(express.static(clientPath))

const server = http.createServer(app);

server.on('error', (err) => {
    console.log('Server error: ', err);
});

server.listen(8080, () => {
    console.log('Klask started on 8080');
});