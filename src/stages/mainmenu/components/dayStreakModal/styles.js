import styled from 'styled-components';
import { ButtonGradient } from '@/styles/style';
import colors, { ConfigsGlobal } from '@/styles/variables';

const PathFolderStreak = 'images/ui/popup_login_streak/';

export const ContainerLoginStreak = styled.div`

    background: url(${PathFolderStreak}window_wtitle.png);
    width: 887px;
    height: 964px;
    text-align: center;
    background-size: cover;
    display: block;
    position: relative;
    margin: 7% auto;
    @media (max-width: 768px) {
        width: 286px;
        height: 292px;
    }
    @media (max-width: 320px) {
        width: 260px;
        height: 280px;
        font-size: 7px;
    }
    .daycount {
        font-family: ${ConfigsGlobal.main_font};
        font-size: 1.8rem;
        position: absolute;
        left: 24px;
        top: 36px;    
        color: black;
        transform: rotate(-33deg);
        @media (max-width: 320px) {
            top: 28px;
        }
        @media (min-width: 1000px) {
            left: 100px;
            top: 150px;
            font-size: 3rem;
        }
    }
`;


export const CounterStone = styled.div`
    font-family: ${ConfigsGlobal.main_font};
    color: #ffffff;
    text-transform: uppercase;
    font-size: 2em;
    span {
        display: block;
        color: ${colors.yellow.dark};
    }
`;

export const BoardSilver = styled.div`
    background: url(${PathFolderStreak}tomorrows_reward_wtitle.png) no-repeat left top;
    width: 760px;
    height: 431px;
    background-size: cover;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    left: 0;
    font-size: 1.5em;
    color: #262626;
    strong {
        display: block;
    }
    @media (max-width: 800px) {
        width: 297px;
        height: 168px;
        background-size: cover;
        position: absolute;
        bottom: -147px;
        left: 0;
    }
    @media (max-width: 320px) {
        width: 262px;
        height: 144px;
        bottom: -130px;
        background-size: contain;
    }
`;

export const ContainerActionModal = styled.div`
  margin: 0 auto;
  display: inline-block;
  padding-top: 100px;
  .containerDiamond {
    width: 120px;
    background: #000000;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    box-sizing: border-box;
    border: 5px solid #51336b;
    box-shadow: 1px -2px 20px 11px inset #66efd554;
    .icon {
        width: 80%;
        margin: 0 auto;
    }
  }
  ${ButtonGradient} {
    margin-top: -20px;
  }
  ${CounterStone} {
    text-align: right;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
`;



export const Header = styled.header`
    background: url('images/ui/location/header_background_location.png') no-repeat left -18px;
    background-size: 100%;
    justify-content: center;
    flex-shrink: 0;
    align-items: flex-start;
    height: 115px;
    display: center;
    align-items: center;
    justify-content: center;
`;

export const Title = styled.h2`
    color: #ffffff;
    font-size: 3.2em;
    padding: 5px 0;
    margin: 0;
    text-align: center;
    line-height: 1.3;
    text-shadow: 1px 0px 3px #0000009c;
    span {
        font-size: 0.7em;
        display: block
    }
`