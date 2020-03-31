"use strict"

import express from 'express'
import socketio from 'socket.io'
import webpack from 'webpack'
import uniqid from 'uniqid'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackConfig from '../../webpack.dev.js'

import Game from './game'

// Creates the express server
const app = express();
app.use(express.static(`${__dirname}/../client`))

// Setup Webpack for development
if (process.env.NODE_ENV === 'development') {
    const compiler = webpack(webpackConfig)
    app.use(webpackDevMiddleware(compiler))

    // Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler))
} else {
    // Static serve the dist/ folder in production
    app.use(express.static('dist'))
}

// Listen on port
const port = process.env.PORT || 8080
const server = app.listen(port, () => {
    console.log('Klask started on 8080')
})
console.log(`Server listening on port ${port}`)

const io = socketio(server)

// Listen to errors on the server
server.on('error', (err) => {
    console.log('Server error: ', err)
})

const GameFactory = () => {
    const id = uniqid.process()
    const namespace = io.of(id)
    const game = new Game(id, namespace)

    namespace.on('connection', socket => {
        console.log('Player connected')
        if (game.playerCount < 2) {
            game.addPlayer(socket)
        } else {
            socket.emit('game-full')
            socket.disconnect()
        }
    })

    namespace.on('disconnect', () => {
        console.log(`Someone disconnected from ${id}`)
        game.stopGame()
    })

    return game;
}

// Start a game
app.get('/start-game', (req, res) => {
    const game = GameFactory()
    res.json({ gameId: game.id })
})