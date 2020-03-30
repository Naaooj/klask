import Game from './game'
import SERVER_URL from './constants'

const writeEvent = (text) => {
    const parent = document.querySelector('#events');

    const el = document.createElement('li')
    el.innerHTML = text;

    parent.appendChild(el)
};

const startGame = () => {
    // Lock the mouse
    document.body.requestPointerLock()

    // Call the server to initialize a game and retrieve an unique socket
    fetch(`${SERVER_URL}/start-game`)
        .then(res => res.json())
        .then(({ gameId }) => {
            const game = new Game(gameId)
            game.init()
            game.start()
        })
}
document.querySelector('#start-game').addEventListener('click', startGame)