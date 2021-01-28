const Point = require('./point');

class LazyPoint extends Point {
    update(point) {
        this.x = point.x;
        this.y = point.y;
    }

    moveByAngle(angle, distance) {
        const angleRotated = angle + (Math.PI / 2);
        this.x += Math.sin(angleRotated) * distance;
        this.y -= Math.cos(angleRotated) * distance;
    }

    equalsTo(point) {
        return this.x === point.x && this.y === point.y;
    }

    getDifferenceTo(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    getDistanceTo(point) {
        const diff = this.getDifferenceTo(point);
        return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2));
    }

    getAngleTo(point) {
        const diff = this.getDifferenceTo(point);
        return Math.atan2(diff.y, diff.x);
    }

    toObject() {
        return {
            x: this.x,
            y: this.y
        };
    }
};

module.exports = LazyPoint;
