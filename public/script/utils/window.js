
const preventContextMenu = () => {
    document.addEventListener('contextmenu', event => event.preventDefault());
};

const calculateCanvasSize = canvasParent => {
    const computedStyle = getComputedStyle(canvasParent);

    const width = canvasParent.clientWidth - parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
    const height = window.innerHeight - parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

    return {
        width,
        height
    };
};

const getCanvasParent = id => {
    const canvasParent = document.getElementById(id);
    return canvasParent;
};

module.exports = { 
    preventContextMenu,
    calculateCanvasSize,
    getCanvasParent
};
