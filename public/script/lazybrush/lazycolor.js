class LazyColor {
    constructor(r, g, b, a = 360) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toColor(sketch) {
        return sketch.color(this.r, this.g, this.b, this.a);
    }

    static fromColor(color) {
        
        if (color.length) {
            const [ r, g, b, a ] = color;
            return new LazyColor(r, g, b, a);
        } else {
            const { r, g, b, a } = color;
            return new LazyColor(r, g, b, a);
        }
    }
}

module.exports = LazyColor;
