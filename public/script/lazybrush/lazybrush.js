const LazyPoint = require('./lazypoint');
const LazyColor = require('./lazycolor');

const RADIUS = 30;

class LazyBrush {
    constructor({ radius = RADIUS, enabled = true, initialPoint = { x: 0, y: 0 }, maxRadius = 50, minRadius = 1} = {}) {
        this.radius = radius;
        this.maxRadius = maxRadius;
        this.minRadius = minRadius;
        this.isEnabled = enabled;

        this.color = new LazyColor(0, 0, 0, 360);
        this.weight = 5;

        this.pointer = new LazyPoint(initialPoint.x, initialPoint.y);
        this.brush = new LazyPoint(initialPoint.x, initialPoint.y);

        this.angle = 0;
        this.distance = 0;
        this.hasMoved = false;
        this.erasing = false;
    }

    randomColor() {
        this.setColor([
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            Math.floor(Math.random() * 255),
            360
        ]);
    }

    setColor(color) {
        this.color = LazyColor.fromColor(color);
    }

    getColor(sketch) {
        return this.color.toColor(sketch);
    }

    toggleEnabled(enabled) {
        this.isEnabled = enabled;
    }
    
    update(newPointerPoint, { both = false } = {}) {
        this.hasMoved = false;
        if (this.pointer.equalsTo(newPointerPoint) && !both) return 0;

        const d = newPointerPoint.getDistanceTo(this.pointer) || 0;

        this.pointer.update(newPointerPoint);
        
        if (both) {
            this.hasMoved = true;
            this.brush.update(newPointerPoint);
            return d;
        }

        if (this.isEnabled) {
            this.distance = this.pointer.getDistanceTo(this.brush);
            this.angle = this.pointer.getAngleTo(this.brush);

            if (this.distance > this.radius) {
                this.brush.moveByAngle(this.angle, this.distance - this.radius);
                this.hasMoved = true;
            }
        } else {
            this.distance = 0;
            this.angle = 0;
            this.brush.update(newPointerPoint);
            this.hasMoved = true;
        }

        return d;
    }

    fromObject(brush) {
        const { color, weight, erasing, brush: { x, y } } = brush;

        this.setColor(color);
        this.weight = weight;
        this.erasing = erasing;
        this.brush = new LazyPoint(x, y);
    }

    toObject() {
        const { color, weight, erasing, brush: { x, y } } = this;

        return {
            color,
            weight,
            erasing,
            brush: {
                x,
                y
            }
        };
    }
}

module.exports = LazyBrush;
