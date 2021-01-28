const { canvasBackground, canvasForeground, canvasHover } = require('./canvas');
const P5 = require('p5');
const io = require('socket.io-client');

new P5(canvasBackground, 'canvas-background');
new P5(canvasHover, 'canvas-hover');
new P5(canvasForeground, 'canvas-foreground');