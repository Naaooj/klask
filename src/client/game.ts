import {KlaskScene} from './game/klask-scene';

export class Game {

    private scene: KlaskScene;
    private playerNumber;
    private movementX;
    private movementY;
    private socket;
    private started: boolean;

    constructor(private gameId: string) {
        this.playerNumber = null
        this.movementX = 0
        this.movementY = 0
        this.socket = null
        this.scene = null
        this.started = false
    }

    init() {
        this.scene = new KlaskScene();
        this.scene.createScene();
    }

    start() {
        window.addEventListener('click', () => {
            if (this.started) { 
                document.body.requestPointerLock();
            }
        });
        window.addEventListener('mousemove', e => {
            this.movementX = e.movementX;
            this.movementY = e.movementY;
        });

        setInterval(() => {
            if (this.movementX === false && this.movementY === false) {
                this.socket.emit('player-moved', { x: 0, y: 0 });
            } else {
                this.socket.emit('player-moved', { x: this.movementX, y: this.movementY });
                this.movementX = false;
                this.movementY = false;
            }
        }, 0);
    }

    setPlayerNumber(data) {
        if (this.playerNumber === null) {
            console.log('Setting player number ' + data);
            document.body.requestPointerLock();
            this.started = true;
            this.playerNumber = data;
            this.scene.setCameraPosition(this.playerNumber);
        }
    }
}
