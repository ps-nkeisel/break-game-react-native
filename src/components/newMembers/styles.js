import styled from 'styled-components';

import colors, { ConfigsGlobal } from '@/styles/variables';
import { ViewBackground, ButtonGradientBigger } from '@/styles/style';


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
    border-top: 6px solid ${colors.primary.normal};
    border-bottom: 6px solid ${colors.primary.normal};
    padding: 20px;
    background: radial-gradient(#1d1c1c, black);
    width: 100%;
`;


export const TitleBigger = styled.h1`
    color: #ffffff;
    text-transform: uppercase;
    font-size: 3em;
    letter-spacing: 2px;
    margin-top: 2px;
    font-weight: 400;
    font-family: ${ConfigsGlobal.secondary_font};
    span {
        color: ${colors.primary.normal};
    }
`;

export const ListItems = styled.div`
    padding: 10px;
    width: 90%;
    text-align: center;
    margin: 20px auto 0px;
    &:before, &:after {
        content: '';
        background: url(images/ui/login_pop_ups/top_separator.png);
        width: 100%;
        height: 4px;
        display: block;
        background-size: 100%;
        margin: 10px 0;
    }
    ${ButtonGradientBigger} {
        max-width: 85%;
    }
`;

export const Text = styled.p`
    color: #ffffff;
    text-transform: uppercase;
    font-size: 20px;
    line-height: 1.4;
    margin: 10px 0;
    strong {
        color: #FFC107;
    }
    h3 {
        margin: 0;
        font-size: 23px;
    }
`;