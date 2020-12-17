import { layout } from '../../../../config/constant'

const max_X = window.innerWidth;
const max_Y = window.innerHeight;

export const backgroundStyle = {
    x: window.innerWidth / 2,
    y: max_Y * 0.32 - 10,
    anchor: { x: "0.5", y: 1 },
    scale: layout.default_scale_design,
    texture: "mainmenu/logo.png"
};

export const backgroundCoinsStyle = {
    x: max_X / 2,
    y: 0,
    anchor: { x: "0.5", y: 0 },
    scale: layout.default_scale_design,
    texture: "mainmenu/coins_container.png"
};

export const coinsIconStyle = {
    x: backgroundCoinsStyle.x - layout.default_scale_design * 240,
    y: backgroundCoinsStyle.y + layout.default_scale_design * 20,
    anchor: { x: "0.5", y: 0 },
    scale: layout.default_scale_design,
    texture: "mainmenu/coinsIcon.png"
};

export const iconPlusIconStyle = {
    x: backgroundCoinsStyle.x + layout.default_scale_design * 240,
    y: backgroundCoinsStyle.y + layout.default_scale_design * 20,
    anchor: { x: "0.5", y: 0 },
    scale: layout.default_scale_design,
    texture: "mainmenu/button_add_coins.png"
};

export const coinsTextStyle = {
    x: backgroundCoinsStyle.x,
    y: backgroundCoinsStyle.y + layout.default_scale_design * 80,
    anchor: 0.5,
    style: {
        stroke: "#3d174a",
        lineJoin: "round",
        strokeThickness: 1,
        fontWeight: 500,
        letterSpacing: 0.5,
        fontFamily: "MarketDeco",
        fontSize: 62 * layout.default_scale_design,
        fill: '#e7af00'
    }
};