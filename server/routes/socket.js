const express = require('express');

const routerModule = ({app, server, io}) => {
    const router = express.Router();
    const rooms = {};

    io.on('connection', socket => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('createRoom', roomId => {
            socket.roomId = roomId;
            socket.room = rooms[roomId] = { strokes: [] };
            socket.join(roomId);
            console.log(`Room(${roomId}) created by Client(${socket.id})`);
        });

        socket.on('joinRoom', roomId => {
            socket.roomId = roomId;
            socket.room = rooms[roomId];
            socket.join(roomId);
            socket.emit('history', socket.room.strokes);
            console.log(`Room(${roomId}) joined by Client(${socket.id})`);
        });

        socket.on('leaveRoom', () => {
            if (socket.roomId) socket.leave(socket.roomId);
            socket.roomId = null;
            socket.room = null;
        });

        socket.on('claimTurn', () => {
            if (!socket.roomId) return;
            socket.to(socket.roomId).broadcast.emit('brushToggle', false)
            socket.emit('brushToggle', true);
        });

        socket.on('clear', () => {
            if (!socket.roomId) return;
            socket.room.strokes = [];
            socket.to(socket.roomId).broadcast.emit('clear');
        });

        socket.on('startStroke', brush => {
            if (!socket.roomId) return;
            socket.brush = brush;
            socket.to(socket.roomId).broadcast.emit('startStroke', brush);
            socket.room.strokes.push({
                brush,
                points: []
            });
        });
    
        socket.on('point', point => {
            if (!socket.roomId) return;
            socket.to(socket.roomId).broadcast.emit('point', point);
            socket.room.strokes[socket.room.strokes.length - 1].points.push(point);
        });
    
        socket.on('endStroke', () => {
            if (!socket.roomId) return;
            socket.to(socket.roomId).broadcast.emit('endStroke');
        });
    });

    return router;
};

module.exports = {
    endpoint: '/socket',
    router: routerModule
};