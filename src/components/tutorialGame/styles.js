import styled from 'styled-components';

import colors from '@/styles/variables';
import { ForwardButton } from '@/styles/style';


export const Container = styled.div`
    background: radial-gradient(black, #1b1b1b);
    border-top: 3px solid ${colors.primary.normal};
    text-align: center;
    border-bottom: 3px solid ${colors.primary.normal};
    position: relative;
    color: #ffffff;
    margin: 0 -40px;
    display: block;
    ${ForwardButton} {
        margin: 0 auto -30px;
        display: block;
    }
`;

export const ItemSlide = styled.div`
    position: absolute;
    left: 0;
    height: 100%:
    padding: 0 15px;
    box-sizing: border-box;
    width: 100%;
    transform: translateX(-100%);
    transition: all 0.4s ease;
    ${({ active }) => active && `transform: translateX(0%); position: relative;`};
    h3 {
        font-size: 2.5em;
        line-height: 1.5;
        margin: 5px 0;
        color: ${colors.primary.normal};
    }
    p {
        font-size: 1.8em;
        line-height: 1.2;
        margin: 5px 0;
    }
    .icon-items {
        margin: 10px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
            width: 30px;
            margin: 10px 5px 0;
        }
    }
`;

export const Slide = styled.div`
    overflow: hidden;
    position: relative;
    padding: 30px;
`;
