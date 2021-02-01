const {
    LazyPoint, LazyBrush
} = require('../lazybrush');

const {
    lazyBrush,
    opponentBrush,
    IoClient
} = require('../shared');

const M = require('materialize-css');

const {
    windowUtils: { getCanvasParent, calculateCanvasSize, preventContextMenu }
} = require('../utils');

function canvasForeground(sketch) {
    sketch.setup = () => {
        preventContextMenu();
        const canvasParent = getCanvasParent('canvas-foreground');
        const { width, height } = calculateCanvasSize(canvasParent);
        sketch.createCanvas(width, height, sketch.P2D).parent(canvasParent);
        sketch.frameRate(0);
        sketch.smooth();
        sketch.noCursor();

        this.io = IoClient.getInstance();

        this.io.listenHistory(this.drawHistory);

        this.io.listenClear(this.clearScreen);

        this.io.listenBrushToggle(enabled => {
            if (enabled) M.toast({html: 'It\'s your turn!'});
            lazyBrush.canDraw = enabled;
        });

        this.io.listenStartStroke(brush => {
            opponentBrush.fromObject(brush);
            this.startStroke(opponentBrush);
        });

        this.io.listenPoint(point => {
            const { x, y } = point;
            opponentBrush.brush.x = x;
            opponentBrush.brush.y = y;
            this.point(opponentBrush, x, y);
        });

        this.io.listenEndStroke(() => {
            this.endStroke(opponentBrush);
        });
    };

    sketch.mousePressed = () => {
        if (!lazyBrush.canDraw) return;

        switch (sketch.mouseButton) {
            case sketch.LEFT:
                lazyBrush.erasing = false;
                this.startStroke(lazyBrush);
                this.io.sendStartStroke(lazyBrush);
                break;
            case sketch.RIGHT:
                lazyBrush.erasing = true;
                this.startStroke(lazyBrush);
                this.io.sendStartStroke(lazyBrush);
                break;
            case sketch.CENTER:
                const c = sketch.get(sketch.mouseX, sketch.mouseY);
                c[3] = 360;
                lazyBrush.setColor(c);
        }
    };

    sketch.mouseDragged = () => {
        if (!lazyBrush.canDraw) return;

        const { x, y } = lazyBrush.brush;
        if (!x || !y) return;

        if (lazyBrush.lastPoint == null || Math.abs((new LazyPoint(x, y).getDistanceTo(new LazyPoint(lazyBrush.lastPoint.x, lazyBrush.lastPoint.y)) > 2))) {
            this.io.sendPoint(lazyBrush);
            this.point(lazyBrush);
        }
    };

    sketch.mouseReleased = () => {
        if (!lazyBrush.canDraw) return;

        this.io.sendEndStroke();
        lazyBrush.erasing = false;
        sketch.noErase();
        lazyBrush.lastPoint = null;
    };

    sketch.keyPressed = () => {
        if (!lazyBrush.canDraw) return;

        switch(sketch.keyCode) {
            case 67:
                lazyBrush.randomColor();
                break;
            case 82:
                this.io.sendClear();
                this.clearScreen();
                break;
        }
        console.log(sketch.keyCode, 'pressed!');
    };
    
    sketch.mouseWheel = (event) => {
        lazyBrush.weight = Math.min(Math.max(lazyBrush.weight + event.delta / 100, 1), 25);
    };

    this.drawHistory = history => {
        this.clearScreen();
        for (const { brush, points } of history) {
            opponentBrush = LazyBrush.fromObject(brush);
            this.startStroke(opponentBrush);
            for (const pnt of points) {
                const { x, y } = pnt;
                opponentBrush.brush.x = x;
                opponentBrush.brush.y = y;
                this.point(opponentBrush, x, y);
            }
        }
    };

    this.clearScreen = () => {
        sketch.clear();
    };

    this.startStroke = brush => {
        const { x, y } = brush.brush;

        if (!brush.erasing) {
            sketch.strokeWeight(brush.weight);
            sketch.stroke(brush.getColor(sketch));
            sketch.point(x, y);
        } else {
            sketch.strokeWeight(brush.weight * 8);
            sketch.erase();
            sketch.point(x, y);
        }
    };

    this.point = brush => {
        const { x, y } = brush.brush;
        if (!x || !y) return;

        let px, py;
        if (!brush.lastPoint) {
            brush.lastPoint = new LazyPoint(x, y);
            px = x;
            py = y;
        } else {
            px = brush.lastPoint.x;
            py = brush.lastPoint.y;
        }

        sketch.line(x, y, px, py);

        brush.lastPoint.x = x;
        brush.lastPoint.y = y;
    };

    this.endStroke = brush => {
        brush.lastPoint = null;
        brush.erasing = false;
    };
};

module.exports = canvasForeground;
