import React, { Component, useState, useEffect,useRef } from 'react'
import { PixiComponent, Stage, Text, Container, TilingSprite, Sprite, AppConsumer } from '@inlet/react-pixi';
import { ease } from 'pixi-ease';

const PIXI = require("pixi.js"),
    { DisplayObject } = PIXI;

const BUTTONS_STATES = {
    normal: 0,
    pressed: 1
}

export default function ImageButton(props) {

    var ui_textures = PIXI.Loader.shared.resources["images/ui_textures.json"].textures;

    const buttonRef = useRef(null);
    const [stateButton, setStateButton] = useState(BUTTONS_STATES.normal)
    const [filters, setFilters] = useState([])
    
    useEffect(()=>{
        if (stateButton == BUTTONS_STATES.pressed){
            var filter = new PIXI.filters.ColorMatrixFilter();
            filter.brightness(1.4)
            
            const DropShadowFilter = require("@pixi/filter-drop-shadow")
            var shadow_filter = new DropShadowFilter.DropShadowFilter();
            shadow_filter.alpha = .1;
            shadow_filter.angle = 10;
            shadow_filter.blur = 10;
            shadow_filter.distance = 0;
            shadow_filter.color = 0xFFFFFF;
            
            setFilters([filter,shadow_filter]);
        }else{
            setFilters([]);
        }
    },[stateButton]);

    useEffect(()=>{
        buttonRef.current.on("pointerdown",()=>{
            setStateButton(BUTTONS_STATES.pressed);
        });
        
        buttonRef.current.on("pointerup",()=>{
            setStateButton(BUTTONS_STATES.normal)
        });
        
        buttonRef.current.on("pointercancel",()=>{
            setStateButton(BUTTONS_STATES.normal)
        });
        buttonRef.current.on("pointerout",()=>{
            setStateButton(BUTTONS_STATES.normal)
        });
        buttonRef.current.on("touchcancel",()=>{
            setStateButton(BUTTONS_STATES.normal)
        });
        buttonRef.current.on("touchend",()=>{
            setStateButton(BUTTONS_STATES.normal)
        });

        buttonRef.current.on("pointertap",(evts)=>{
            if (typeof props.onClick == "function"){
                props.onClick(evts);
            }
        });


    },[]);


    return (
        <Sprite interactive={true} ref={buttonRef} filters={filters} {...props} texture={props.texture} />
    );
}