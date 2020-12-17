const PIXI = require("pixi.js"),
    { Graphics } = PIXI;


export default function(fromx, fromy, tox, toy, drawArrowEdge=false){
    const graphics = new Graphics();
    // graphics.zIndex = zIndex.MOVIMENT_ARROW;
    var headlen = 10;
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    graphics.lineStyle(1, 0x33FF00);
    graphics.moveTo(fromx, fromy);
    graphics.lineTo(tox, toy);
    if (drawArrowEdge){
        graphics.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        graphics.moveTo(tox, toy);
        graphics.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }
    return graphics;
}