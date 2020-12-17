import styled from 'styled-components';

import colors from '@/styles/variables';
import { ButtonGradientBigger } from '@/styles/style';

export const ContainerJail = styled.div`
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    border-top: 6px solid ${colors.primary.normal};
    border-bottom: 6px solid ${colors.primary.normal};
    text-align: center;
    background: #1a1b1b;
    .title {
        font-size: 2.2em;
        text-transform: uppercase;
        line-height: 1.5;
        span {
            color: #ffbb0f;
        }
        strong {
            font-size: 1.3em;
        }
    }
    .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;


export const Text = styled.p`
    color: #ffffff;
    font-size: 20px;
    text-transform: uppercase;
    line-height: 1.3;
    padding: 0 10%;
`;

export const ContainerLoots = styled.div`
    border-radius: 5px;
    background-color: #261e2b;
    padding: 10px;
    text-align: center;
    display: block;
    width: 280px;
    margin: 10px auto 30px;
    .counter {
        text-transform: uppercase;
        color: ${colors.primary.normal};
        font-size: 25px;
        line-height: 30px;
        margin: 5px 0;
        span {
            color: #ffffff;
        }
        &:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            background: url(images/ui/in_game_UI/pop_up_complete/icon_loot.png) no-repeat left top;
            width: 80px;
            height: 80px;
            background-size: contain;
        }
    }
    p {
        color: ${colors.primary.normal};
        font-size: 1.6em;
        strong {
            color: ${colors.orange.normal};
            display: block;
            font-size: 1.6em;
        }
    }
`


export const FooterAction = styled.footer`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 60px;
    box-sizing: border-box;
    ${ButtonGradientBigger} {
        max-width: 138px;
        height: 50px;
        margin: 0 10px;
        span {
            font-size: 19px;

            @media(max-width: 379px) {
                font-size: 16px;
            }
            @media(max-width: 336px) {
                font-size: 14px;
            }
        }
    }
`;