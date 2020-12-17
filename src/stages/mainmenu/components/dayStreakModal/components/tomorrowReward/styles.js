/* eslint-disable import/prefer-default-export */
import styled, {keyframes} from 'styled-components';

import { Pullse } from '@/styles/animations';
import { ContainerCenterDefault, ButtonGradient } from '@/styles/style';

const PathFolder = 'images/ui/popup_reward_adquired/';

const PulseDiamond = keyframes`
  0% {
    transform: scale3d(1, 1, 1);
  }
  50% {
    transform: scale3d(1.2, 1.2, 1.2);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
`;

const RotateDiamond = keyframes`
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(360deg)
  }
`;

export const TitlePulse = styled.img`
    width: 85%;
    display: block;
    margin: 2% auto;
    animation: ${Pullse} 0.7s infinite;
`;


export const ContainerDiamond = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    text-align: center;
    background-size: 100%;
    justify-content: center;
    background-size: contain;
    margin-bottom: 50px;
    z-index: 10;
    position: absolute;
    left: 0;
    margin: auto;
    right: 0;
    bottom: 0;
    top: 0;
    &:after {
        content: '';
        position: absolute;
        top: -50px;
        left: 0;
        width: 230px;
        height: 230px;
        bottom: 0;
        margin: auto;
        right: 0;
        background: url(${PathFolder}underlight_item_holder.png) no-repeat center center;
        background-size: 100%;
        animation: ${RotateDiamond} 3s infinite;
    }
    .ico {
        width: 65%;
        position: relative;
        z-index: 50;
        animation: ${PulseDiamond} 3s ease-in infinite;
    }
`;

export const DiamondCircle = styled.div`
    width: 230px;
    height: 230px;
    border: 5px solid #ffffff;
    border-radius: 100%;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    box-shadow: -2px -1px 16px 9px #b6ffd2ba, 1px 2px 10px 7px inset #000000, 2px 3px 20px 20px inset #39ffab9e;
`;

export const Container = styled(ContainerCenterDefault)`
    height: 100vh;
    background-size: 140%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    padding: 0px 0 100px;
    box-sizing: border-box; 
    ${ButtonGradient} {
      position: relative;
      z-index: 100;
    }
`;