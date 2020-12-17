import React, { Component, useState, useEffect, useRef } from 'react'
import { PixiComponent, Graphics, Stage, Text, Container, TilingSprite, Sprite, AppConsumer } from '@inlet/react-pixi';
import { ease } from 'pixi-ease';
import ImageButton from '../../../../../../components/imageButton';

import {textStyle} from './styles'

export default function Header(props) {

    const { active = 0, title = "Undefined" } = props;

    const textRef = useRef();
    const bgRef = useRef();
    const [widthText, setWidthText] = useState(0);
    const heightText = 75;
    

    function drawRoundedRectangle(g) {
        g.beginFill(0xFFFFFF);
        g.drawRoundedRect(0, 0, widthText, heightText, 20);
        g.endFill();
    }

    useEffect(()=>{
        setWidthText(textRef.current.width + 30);
    },[title])

    return (
        <Container {...props}>
            <Graphics ref={bgRef} visible={active == 1} anchor={0.5} draw={drawRoundedRectangle} />
            <Text ref={textRef} x={widthText/2} y={heightText/2} text={title} {...textStyle} />
        </Container>
    );
}