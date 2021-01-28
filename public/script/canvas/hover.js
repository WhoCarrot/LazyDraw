const {
    Point,
    LazyPoint
} = require('../lazybrush');

const {
    windowUtils: { getCanvasParent, calculateCanvasSize },
    p5Utils: { run }
} = require('../utils');

const {
    lazyBrush,
    IoClient
} = require('../shared');

function canvasHover(sketch) {
    const tear = [];
    const holeSize = 30;

    sketch.setup = () => {
        const canvasParent = getCanvasParent('canvas-hover');
        const { width, height } = calculateCanvasSize(canvasParent);

        sketch.noCursor();
        sketch.smooth();
        sketch.frameRate(144);
        sketch.createCanvas(width, height);

        this.generateTear();

        this.io = IoClient.getInstance();
    };

    sketch.draw = () => {
        sketch.clear();
        
        const d = lazyBrush.update(new LazyPoint(sketch.mouseX, sketch.mouseY));
        lazyBrush.radius = Math.max(Math.min(sketch.map(d, 0, 10, 0, 10), lazyBrush.maxRadius), lazyBrush.minRadius);

        run(sketch, [
            this.drawRadius,
            this.drawTear,
            this.drawPointer,
            this.drawFPS
        ]);
    };

    this.drawRadius = function(sketch) {
        sketch.noFill();
        sketch.stroke(sketch.color(0, 0, 0, 100));

        const { x, y } = lazyBrush.pointer;
        const { radius } = lazyBrush;

        sketch.circle(x, y, radius * 2);
    };

    this.drawPointer = () => {
        const { x, y } = lazyBrush.pointer;

        sketch.strokeWeight(lazyBrush.weight);
        sketch.stroke(0);
        sketch.point(x, y);
    };

    this.drawBrush = function(sketch) {
        sketch.stroke(0, 0, 0);
        const { x, y } = lazyBrush.brush;
        if (sketch.mouseIsPressed && sketch.mouseButton === sketch.RIGHT) sketch.strokeWeight(lazyBrush.weight * 4);
        else sketch.strokeWeight(lazyBrush.weight);
        sketch.point(x, y);
    };

    this.drawFPS = function(sketch) {
        const { width } = sketch;
        const fps = sketch.frameRate();
        sketch.stroke(0);
        sketch.textAlign(sketch.RIGHT);
        sketch.text(Math.round(fps / 10) * 10, width - 25, 25);
    };

    this.drawTear = function(sketch) {
        const { height } = sketch;

        sketch.noStroke();
        sketch.fill(255);

        sketch.beginShape();
        sketch.vertex(-1, 0);
        for (const { x, y } of tear) {
            sketch.vertex(x, y);
        }
        sketch.vertex(-1, height);
        sketch.endShape();
        
        sketch.noStroke();
        sketch.fill(255);
        
        const holeSpacing = height / 4;
        const holePadding = holeSize * 1.75;

        sketch.circle(holePadding, holeSpacing, holeSize);
        sketch.circle(holePadding, holeSpacing * 3, holeSize);
    };

    this.generateTear = () => {
        for (let y = 0; y < sketch.height; y += 3) {
            const x = sketch.map(sketch.noise(y / 12.5), 0, 1, 0, holeSize * 0.75);
            tear.push(new Point(x, y));
        }
    }
};

module.exports = canvasHover;
