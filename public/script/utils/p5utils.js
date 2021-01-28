const run = async (sketch, fns) => {
    sketch.push();
    for (const fn of fns) await fn(sketch);
    sketch.pop();
};

module.exports = { run };
