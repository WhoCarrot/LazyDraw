const { v4 } = require('uuid');
const express = require('express');

const routerModule = ({app, server, io}) => {
    const router = express.Router();

    router.get('/', (req, res) => {
        console.log('request received');
    });

    io.on('connection', socket => {
        console.log(socket.handshake.query);
        let currentBrush;

        socket.on('startStroke', brush => {
            console.log('START STROKE', JSON.stringify(brush));
            currentBrush = brush;

            socket.broadcast.emit('startStroke', currentBrush);
        });
    
        socket.on('point', point => {
            console.log('POINT', JSON.stringify(point));

            socket.broadcast.emit('point', point);
        });
    
        socket.on('endStroke', () => {
            console.log('END STROKE');

            socket.broadcast.emit('endStroke');
        });
    });

    return router;
};

module.exports = {
    endpoint: 'socket',
    router: routerModule
};