import { layout } from '../../../../config/constant'

const max_X = window.innerWidth;
const max_Y = window.innerHeight;

var offsetY = 125 * layout.default_scale_design

export const portraitHolderStyle = {
    x: 230 * layout.default_scale_design,
    y: max_Y - offsetY,
    anchor: 0.5,
    scale: layout.default_scale_design,
    texture: "mainmenu/portrait__holder.png"
};

export const portraitHolderBGStyle = {
    x: portraitHolderStyle.x + (70 * layout.default_scale_design),
    y: portraitHolderStyle.y,
    anchor: 0.5,
    scale: layout.default_scale_design,
    texture: "mainmenu/player_profile_image_mask_shape.png"
};

export const portraitHolderProfileImageStyle = {
    x: portraitHolderStyle.x + (70 * layout.default_scale_design),
    y: portraitHolderStyle.y,
    anchor: 0.5,
    scale: layout.default_scale_design,
    texture: "mainmenu/temporal_profile_image.png"
};

export const barExperienceStyle = {
    x: portraitHolderStyle.x - 150 * layout.default_scale_design,
    y: portraitHolderStyle.y + 30 * layout.default_scale_design,
    anchor: 0.5,
    scale: layout.default_scale_design
};

export const coinsTextStyle = {
    x: portraitHolderStyle.x - 90 * layout.default_scale_design,
    y: portraitHolderStyle.y - 21 * layout.default_scale_design,
    anchor: 0.5,
    style: {
        stroke: "#3d174a",
        lineJoin: "round",
        strokeThickness: 1,
        fontWeight: 400,
        letterSpacing: 1.6,
        fontFamily: "sugar",
        fontSize: 62 * layout.default_scale_design,
        fill: '#FFFFFF'
    }
};

export const userNameTextStyle = {
    x: 440 * layout.default_scale_design,
    y: max_Y - offsetY,
    anchor: {x:0, y:0.5},
    style: {
        lineJoin: "round",
        strokeThickness: 1, 
        fontWeight: 500,
        letterSpacing: 1.6,
        fontFamily: "MarketDeco",
        fontSize: 62 * layout.default_scale_design,
        fill: '#FFFFFF'
    }
};