import React, { Component, useState, useEffect } from 'react'
import { PixiComponent, Stage, Text, Container, TilingSprite, Sprite, AppConsumer } from '@inlet/react-pixi';

import ImageButton from '../imageButton'
import {textStyle, btnStyle} from './styles'

const PIXI = require("pixi.js"),
    { DisplayObject } = PIXI;

export default function element(props) {
    const {text="OK"} = props;
    var ui_textures = PIXI.Loader.shared.resources["images/ui_textures.json"].textures;

    return (
        <Container {...props}>
            <ImageButton onClick={props.onClick} {...btnStyle} texture={ui_textures["general_shared_items/button_play.png"]} />
            <Text {...textStyle} text={text} anchor={0.5} />
        </Container>
    );
}