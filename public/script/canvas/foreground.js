const {
    LazyPoint
} = require('../lazybrush');

const {
    lazyBrush,
    opponentBrush,
    IoClient
} = require('../shared');

const {
    windowUtils: { getCanvasParent, calculateCanvasSize, preventContextMenu }
} = require('../utils');

function canvasForeground(sketch) {
    sketch.setup = () => {
        preventContextMenu();
        const canvasParent = getCanvasParent('canvas-foreground');
        const { width, height } = calculateCanvasSize(canvasParent);
        sketch.createCanvas(width, height).parent(canvasParent);
        sketch.frameRate(144);
        sketch.smooth();
        sketch.noCursor();

        this.io = IoClient.getInstance();

        this.io.listenStartStroke(brush => {
            console.log(brush);
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
        const { x, y } = lazyBrush.brush;
        if (!x || !y) return;

        if (lazyBrush.lastPoint == null || Math.abs((new LazyPoint(x, y).getDistanceTo(new LazyPoint(lazyBrush.lastPoint.x, lazyBrush.lastPoint.y)) > 2))) {
            this.io.sendPoint(lazyBrush);
            this.point(lazyBrush);
        }
    };

    sketch.mouseReleased = () => {
        this.io.sendEndStroke();
        lazyBrush.erasing = false;
        sketch.noErase();
        lazyBrush.lastPoint = null;
    };

    sketch.keyPressed = () => {
        switch(sketch.keyCode) {
            case 67:
                lazyBrush.randomColor();
                break;
            case 82:
                sketch.clear();
                break;
        }
        console.log(sketch.keyCode, 'pressed!');
    };
    
    sketch.mouseWheel = (event) => {
        lazyBrush.weight = Math.min(Math.max(lazyBrush.weight + event.delta / 100, 1), 25);
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
    }

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
    }

    this.endStroke = brush => {
        brush.lastPoint = null;
        brush.erasing = false;
    }
}

module.exports = canvasForeground;
