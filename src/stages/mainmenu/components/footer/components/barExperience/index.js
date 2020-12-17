import React from 'react';

import { PixiComponent, Sprite, Stage, Text, Container } from '@inlet/react-pixi';

const DropShadowFilter = require("@pixi/filter-drop-shadow")



const PIXI = require("pixi.js"),
    { DisplayObject, Graphics } = PIXI;


const RoundedRectangle = PixiComponent('RoundedRectangle', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x = 0, y = 0, width, height, fill, radius, shadow } = props;
        instance.cacheAsBitmap = true
        instance.clear();
        instance.beginFill(fill, 1);
        instance.drawRoundedRect(x, y, width, height, radius);
        instance.endFill();
    },
});

const RoundedRectangleShadow = PixiComponent('RoundedRectangle2', {
    create: props => new Graphics(),
    applyProps: (instance, _, props) => {
        const { x = 0, y = 0, width, height, fill, radius, shadow } = props;


        var shadow_filter = new DropShadowFilter.DropShadowFilter();
        shadow_filter.alpha = .1;
        shadow_filter.angle = 10;
        shadow_filter.blur = 1;
        shadow_filter.distance = 0;
        shadow_filter.color = 0xFFFFFF;
        instance.filters = [shadow_filter]
        
        var mask = new Graphics();
        mask.drawRect(x,y,width,height);
        instance.cacheAsBitmap = true
        instance.clear();
        instance.beginFill(fill, 1);
        instance.drawRoundedRect(x, y, width, height, radius);
        instance.endFill();


        
    },
});


const expBar = (props) => {
    var ui_textures = PIXI.Loader.shared.resources["images/ui_textures.json"].textures;

    const porcentage = props.porcentage;

    const maxWidth = 111;

    const currentWidth = maxWidth * (porcentage / 100);


    return (
        <>
            <Container {...props} >
                <RoundedRectangle fill={0x221229} width={maxWidth} height={30} radius={8} />
                <RoundedRectangleShadow fill={0x9E62DF} width={currentWidth} height={30} radius={8} />
            </Container>
        </>
    );
};

export default expBar;