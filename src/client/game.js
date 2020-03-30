import io from 'socket.io-client'
import SERVER_URL from './constants'
import KlaskScene from './klask-scene'
import log from './log'

class Game {

    constructor(gameId) {
        this.gameId = gameId
        this.playerNumber = null
        this.movementX = 0
        this.movementY = 0
        this.socket = null
        this.scene = null
    }

    init() {
        this.scene = new KlaskScene()
        this.scene.createScene()

        this.bindSocket()
    }

    bindSocket() {
        const socket = io(`${SERVER_URL}/${this.gameId}`)
        socket.on('player-number-assigned', data => this.setPlayerNumber(data))
        socket.on('physics-updated', data => this.updatePositions(data))
        this.socket = socket
    }

    start() {
        window.addEventListener('click', () => document.body.requestPointerLock())
        window.addEventListener('mousemove', e => {
            this.movementX = e.movementX
            this.movementY = e.movementY
        })

        setInterval(() => {
            if (this.movementX === false && this.movementY === false) {
                this.socket.emit('player-moved', { x: 0, y: 0 })
            } else {
                this.socket.emit('player-moved', { x: this.movementX, y: this.movementY })
                this.movementX = false
                this.movementY = false
            }
        }, 0)
    }

    setPlayerNumber(data) {
        if (this.playerNumber === null) {
            log.info('Setting player number ' + data)
            this.playerNumber = data
        }
    }

    updatePositions(data) {
        this.scene.setPositions(data)
    }
}
export default Game