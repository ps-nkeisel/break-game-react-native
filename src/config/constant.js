const baseScale = 0.4;
const baseWidth = 980;
const baseDensity = 2;

const widthProportion = window.innerWidth / 980;
const scale = baseScale * widthProportion;
const density = window.devicePixelRatio * (baseDensity / window.devicePixelRatio)

exports.layout = {
    default_scale_design: scale * density
}

