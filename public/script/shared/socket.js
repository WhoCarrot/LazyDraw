const io = require('socket.io-client');
const uuid = require('shortid');

class IoClient {
    constructor() {
        this.io = io({
            reconnection: true,
            rejectUnauthorized: false, 
            cors: {
                origin: "http://localhost:8080",
                methods: ["GET", "POST"]
            }
        });
    }

    joinRoom(roomId) {
        this.io.emit('joinRoom', roomId);
    }

    createRoom(roomId = uuid.generate()) {
        this.io.emit('createRoom', roomId);
    }

    sendClaimTurn() {
        this.io.emit('claimTurn');
    }

    sendLocation(brush) {
        this.io.emit('location', {
            pointer: brush.pointer.toObject(),
            brush: brush.brush.toObject()
        });
    }

    sendStartStroke(brush) {
        this.io.emit('startStroke', brush.toObject());
    }

    sendPoint(brush) {
        this.io.emit('point', brush.brush.toObject());
    }

    sendEndStroke() {
        this.io.emit('endStroke');
    }
    
    sendClear() {
        this.io.emit('clear');
    }

    listenRoomCreated(cb) {
        this.io.on('roomCreated', cb);
    }

    listenHistory(cb) {
        this.io.on('history', cb);
    }

    listenClear(cb) {
        this.io.on('clear', cb);
    }

    listenBrushToggle(cb) {
        this.io.on('brushToggle', cb);
    }

    listenStartStroke(cb) {
        this.io.on('startStroke', cb);
    }

    listenPoint(cb) {
        this.io.on('point', cb);
    }

    listenEndStroke(cb) {
        this.io.on('endStroke', cb);
    }
}

class Singleton {
    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!Singleton.instance) Singleton.instance = new IoClient();
        return Singleton.instance;
    }
}

module.exports = Singleton;
