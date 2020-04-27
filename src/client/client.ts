import {Game} from './game';
import * as constants from './constants';
import "./style.scss";

window.addEventListener('DOMContentLoaded', () => {

    console.log("Klask starting");

    const startGameWithId = (gameId: string) => {
        const game = new Game(gameId);
        game.init();
        game.start();
    
        //let controller = new Controller();
    }

    const startGame = () => {
        console.log("Server url", constants.SERVER_URL);
        
        (document.querySelector('#home-container') as HTMLElement).style.display = 'none';

        startGameWithId("123456");

        // Call the server to initialize a game and retrieve an unique socket
        // fetch(`${constants.SERVER_URL}/start-game`)
        //     .then(res => res.json())
        //     .then(({ gameId }) => {
        //         document.querySelector('#game').innerHTML = "Game Id: " + gameId;
        //         startGameWithId(gameId);
        //     })
    }
    document.querySelector('#start-game').addEventListener('click', startGame)
    
    const joinGame = () => {
        var gameId = (document.querySelector('#game-id') as HTMLInputElement).value;
        if (gameId) {
            startGameWithId(gameId);
        }
    }
    document.querySelector('#join-game').addEventListener('click', joinGame);
});