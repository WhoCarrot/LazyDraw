const {
    windowUtils: { getCanvasParent, calculateCanvasSize },
    p5Utils: { run }
} = require('../utils');

function canvasBackground(bsketch) {
    const gridSize = 25;

    bsketch.setup = () => {
        const canvasParent = getCanvasParent('canvas-background');
        const { width, height } = calculateCanvasSize(canvasParent);

        bsketch.createCanvas(width, height);

        run(bsketch, [
            this.drawPaper
        ]);
    };

    this.drawPaper = () => {
        const { width, height } = bsketch;

        bsketch.background(230);

        bsketch.stroke(0, 0, 0, 50);
        bsketch.noFill();

        for (let x = -gridSize / 2; x < width; x += gridSize)
            bsketch.line(x, 0, x, height);

        for (let y = -gridSize / 2; y < height; y += gridSize)
            bsketch.line(0, y, width, y);
    };
};

module.exports = canvasBackground;
