import styled from 'styled-components';

import colors, { ConfigsGlobal } from '@/styles/variables';
import { ViewBackground } from '@/styles/style';


export const Container = styled.div`
    display: block;
    box-sizing: border-box;
    text-align: center;
    background: #1a1b1b;
    margin: 0;
    position: relative;
    width: 100vw;
    background: black;
    ${ViewBackground} {
        width: 100vw;
        padding: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
`;

export const BoxContainer = styled.div`
    padding: 20px;
    background: radial-gradient(#1d1c1c, black);
    width: 286px;
    background: url(images/ui/login_pop_ups/message_4/window_background.png) no-repeat left top;
    background-size: contain;
    height: 260px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    right: 0;
    &:before {
        content: ''; 
        width: 180px;
        height: 110px;
        background: url(images/ui/login_pop_ups/message_4/icon_crew.png) no-repeat center top;
        background-size: 100%;
        display: block;
        margin: -80px auto 0px;
    }
`;


export const TitleBigger = styled.h1`
    color: #ffffff;
    text-transform: uppercase;
    font-size: 2.7em;
    letter-spacing: 2px;
    margin-top: 2px;
    font-weight: 400;
    font-family: ${ConfigsGlobal.secondary_font};
    text-shadow: 3px 3px 3px #00000082;
    span {
        color: ${colors.primary.normal};
    }
`;

export const Header = styled.header`
    text-align: center;
    background: url(images/ui/battle_pass/background_header.png) no-repeat left top;
    background-size: 100%;
    position: fixed;
    height: 105px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    z-index: 1;
    width: 100vw;
    box-sizing: border-box;
`

export const Text = styled.p`
    text-transform: uppercase;
    color: #ffffff;
    font-size: 1.8em;
    line-height: 1.3;
    strong {
        color: #ffc107;
        font-size: 25px;
        display: block;
    }
`;