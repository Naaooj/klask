import io from 'socket.io-client';
import matter from 'matter-js';

const writeEvent = (text) => {
    const parent = document.querySelector('#events'); 

    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
};

// Get the socket
const sock = io();

// Listen to message broadcasted by any client
sock.on('message', writeEvent);

const sendMessage = (e) => {
    e.preventDefault();

    const input = document.querySelector('#message');
    const text = input.value;
    sock.emit('message', text);
    input.value = null;
};

document.querySelector('#chat-form').addEventListener('submit', sendMessage);