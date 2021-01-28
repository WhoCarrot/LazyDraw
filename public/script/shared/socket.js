const io = require('socket.io-client');

class IoClient {
    constructor() {
        this.io = io({
            reconnection: true,
            rejectUnauthorized: false, 
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
        });
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
