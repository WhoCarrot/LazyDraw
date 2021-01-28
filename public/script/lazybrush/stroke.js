const Point = require('./point');

class Stroke {
    constructor(x, y, color, size) {
        this.points = [ new Point(x, y) ];
        this.color = color;
        this.size = size;
    }

    addPoint(x, y) {
        this.points.push(new Point(x, y));
    }
}

module.exports = Stroke;
