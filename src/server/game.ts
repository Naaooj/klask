import {Player} from './player'
//import {Physics} from './physics'

export class Game {
    private id;
    private io;
    private player1;
    private player2;
    private playerCount;
    //private physics;

    constructor(id, io) {
        this.id = id
        this.io = io
        this.player1 = null
        this.player2 = null
        this.playerCount = 0
        //this.physics = null
    }

    addPlayer(socket: any) {
        if (!this.player1) {
            console.log("Adding player 1")
            this.player1 = new Player(socket, () => this.playerReady())
            this.player1.handleReady()
        } else {
            console.log("Adding player 2")
            this.player2 = new Player(socket, () => this.playerReady())
            this.player2.handleReady()
        }

        this.playerCount++
    }

    playerReady() {
        if (this.player1 && this.player2 && this.player1.ready === true && this.player2.ready === true) {
            this.startGame()
        }
    }

    startGame() {
        console.log("Start game")
        // Generates or 0 and 1
        const playerStartRandom = Math.round(Math.random());
        //this.physics = new Physics(this.io, this.player1, this.player2)
        //this.physics.startPhysics(playerStartRandom)

        this.player1.socket.emit('player-number-assigned', 1)
        this.player2.socket.emit('player-number-assigned', 2)
    }

    stopGame() {
        console.log("Stop game")
        //this.physics.stopPhysics()
    }
}