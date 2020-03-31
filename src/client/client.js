import Game from './game'
import * as constants from './constants'

const startGameWithId = (gameId) => {
    const game = new Game(gameId)
    game.init()
    game.start()
}

const startGame = () => {
    // Call the server to initialize a game and retrieve an unique socket
    fetch(`${constants.SERVER_URL}/start-game`)
        .then(res => res.json())
        .then(({ gameId }) => {
            document.querySelector('#game').innerHTML = "Game Id: " + gameId
            startGameWithId(gameId)
        })
}
document.querySelector('#start-game').addEventListener('click', startGame)

const joinGame = () => {
    var gameId = document.querySelector('#game-id').value
    if (gameId) {
        startGameWithId(gameId)
    }
}
document.querySelector('#join-game').addEventListener('click', joinGame)