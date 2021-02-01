const P5 = require('p5');
const M = require('materialize-css');
const { canvasBackground, canvasForeground, canvasHover } = require('./canvas');

const { IoClient } = require('./shared');
const io = IoClient.getInstance();

const initCanvas = () => {
    new P5(canvasBackground, 'canvas-background');
    new P5(canvasHover, 'canvas-hover');
    new P5(canvasForeground, 'canvas-foreground');
};

const initDOM = () => {
    document.addEventListener('DOMContentLoaded', () => {
        // Room join / create dialog
        const modals = document.getElementsByClassName('.modal');
        M.Modal.init(modals);

        // Claim turn trigger
        const turnTrigger = document.getElementById('claim-turn-button');
        turnTrigger.addEventListener('click', () => io.sendClaimTurn());

        // Join room trigger
        const joinRoomTrigger = document.getElementById('join-room-button');
        joinRoomTrigger.addEventListener('click', () => {
            const roomId = document.getElementById('room-id-input').value;
            io.joinRoom(roomId);
        });

        // Create room trigger
        const createRoomTrigger = document.getElementById('create-room-button');
        createRoomTrigger.addEventListener('click', () => io.createRoom());
    });
};

initCanvas();
initDOM();
