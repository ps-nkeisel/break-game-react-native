import styled from 'styled-components';

import colors, {ConfigsGlobal} from '@/styles/variables';
import { ViewBackground, TitleGlow, TitleHeaderGlow } from '@/styles/style';
import { FigureItem } from '@/stages/gear/styles';


export const Container = styled.div`
    display: block;
    box-sizing: border-box;
    text-align: center;
    background: #1a1b1b;
    margin: 0;
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: -35px;
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
    background: radial-gradient(#1d1c1c, black);
    width: 100%;
    margin: 100px 0 10px;
    .view {
        background: radial-gradient(#4c4a4a,black);
        border-bottom: 6px solid ${colors.primary.normal};
        border-top: 6px solid #844eb2;
        padding: 10px 30px;
    }
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        h3 {
            font-size: 16px;
            max-width: 80px;
        }
        .ico {
            width: 125px;
            object-fit: contain;
            margin: -25px 25px;
        }
    }
    .list {
        padding: 20px 10px 0;
        border-top: 4px solid ${colors.primary.normal};
        border-bottom: 4px solid ${colors.primary.normal};
        list-style: none;
        margin-top: 10px;
    }
    .item-list {
        list-style: none;
        display: flex;
        margin: 15px 0;
        align-items: center;
        flex-wrap: wrap;
        justify-content: flex-end;
        border-bottom: 2px solid ${colors.primary.normal};
        &:last-child {
            border-bottom: 0;
        }
        .number {
            width: 30px;
            height: 45px;
            font-size: 22px;
            color: #ffffff;
            margin-right: 10px;
            background: #43374c;
            text-align: center;
            line-height: 45px;
        }
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
    span {
        color: ${colors.primary.normal};
    }
`;

export const ListItems = styled.ul`
    padding: 10px;
    width: 90%;
    margin: 20px auto 60px;
    &:before, &:after {
        content: '';
        background: url(images/ui/login_pop_ups/top_separator.png);
        width: 100%;
        height: 4px;
        display: block;
        background-size: 100%;
        margin: 10px 0;
    }
`;

export const Item = styled.li`
    display: flex;
    align-items: center;
    margin: 5px 0;
    justify-content: space-between;
    .ico {
        width: 30px;
    }
    p {
        font-size: 13px;
        padding: 0 5px;
        span {
            color: #FFC107;
        }
    }
`;

export const Header = styled.header`
    text-align: center;
    background: url('images/ui/battle_pass/background_header.png') no-repeat left top;
    background-size: 100%;
    position: fixed;
    top: 0;
    padding: 0 20px;
    z-index: 1;
    display: flex;
    width: 100vw;
    min-height: 110px;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    ${TitleHeaderGlow} {
        display: flex;
        align-items: center;
        max-width: 40%;
    }
`

export const Footer = styled.footer`
    text-align: center;
    background: #000000;
    position: fixed;
    bottom: 0px;
    padding: 20px;
    z-index: 1;
    width: 100vw;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: url(images/ui/general_shared_items/background_general.png) no-repeat left top;
    background-size: 100%;
    ${TitleGlow} {
        text-align: right;
        font-size: 2.2em;
        line-height: 1.3;
        color: #ffffff;
        small {
            font-size: 0.6em;
            display: block;
        }
    }
`;

export const BadgeClaim = styled.div`
    height: 45px;
    border-radius: 10px;
    background: black;
    background-image: radial-gradient(#312338,#3a284a);
    color: #ffffff;
    display: flex;
    text-transform: uppercase;
    align-items: center;
    justify-content: space-around;
    width: 33%;
    margin: 15px 1%;
    padding: 0 5px;
    border-top: 1px solid #ffffff47;
    position: relative;
    border-left: 1px solid #ffffff2e;
    border-right: 1px solid #ffffff66;
    border-bottom: 4px solid #00000026;
    .coins {
        font-size: 12px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
        margin: 0 5px;
        flex: 1;
        strong {
            color: #ffd111;
            display: block;
        }
    }
    .xp {
        background: #3a284a;
        position: absolute;
        font-size: 9px;
        top: -21px;
        right: 5px;
        padding: 5px;
        span {
            color: #ffd111;
        }
    }
    ${FigureItem} {
        width: 50px;
        height: 50px;
    }
    ${({ gold }) => gold 
        && `background-image: linear-gradient(to bottom,#243d02,#77690b);
            border-bottom: 4px solid #585708;
            box-shadow: -1px 1px 6px black, 0px 0px 6px #ececd1;
        }`
    };
    ${({ disabled }) => disabled 
        && `filter: grayscale(1);
        }`
    };
`;

export const ButtonBuy = styled.button`
    background: url(images/ui/battle_pass/button_buy_battlepass.png) no-repeat left top;
    width: 150px;
    height: 70px;
    background-size: 100%;
    text-align: left;
    padding-left: 20px;
    font-family: ${ConfigsGlobal.main_font};
    text-transform: uppercase;
    box-sizing: border-box;
    font-size: 24px;
    color: #ffc60a;
    line-height: 80px;
    cursor: pointer;
    font-size: 24px;
    color: #ffc60a;
    text-shadow: 1px 1px 3px #3c4a05;
`;