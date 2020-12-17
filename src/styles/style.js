import styled, { createGlobalStyle } from 'styled-components';

import rotateEngine, { Pullse } from './animations';

import { ButtonVolume } from '@/components/volumeControl/styles';

import colors, { ConfigsGlobal } from './variables';


const PathMainMenu = 'images/ui/mainmenu/';

export const ViewBackground = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: black;
  position: absolute;
  left: 0;
  top: 0;
  color: #ffffff;
  background: url('images/ui/general_shared_items/background_general.png') repeat-y -2px top;
  background-size: 120%;
  overflow: hidden;
  padding: 0;
`;

export const DrawBackgroundBlack = styled.div`
  position: relative;
  background: rgba(0,0,0,0.7);
  width: 100vw;
  padding: 20px;
`;

export const BoxMetal = styled.div`
  background: url('${PathMainMenu}backgroundSafe.png') no-repeat left center;
  background-size: cover;
  width: 650px;
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 525px;
  z-index: 4;
  padding-left: 20%;
  left: -5%;
  box-sizing: border-box;
  @media (max-width: 650px) {
    width: 320px;
    height: 262px;
    font-size: 6px;
  }
  @media (max-width: 360px) {
    width: 250px;
    height: 203px;
    font-size: 4px;
  }
`;

export const BrandGame = styled.img`
  display: block;
  margin: 0 auto;
  position: relative;
  z-index: 12;
  width: 100%;
  margin-top: 55px;
`;

export const EngineRotate = styled.div`
  background: url('${PathMainMenu}safe_knob_middle.png') no-repeat center center;
  background-size: contain;
  width: 45%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justiy-content: center;
  position: absolute;
  left: 14px;
  height: 30vh;
  animation: ${rotateEngine} 6s infinite;
  @media (max-width: 650px) {
    width: 42%;
    height: 262px;
    left: 10px;
    bottom: -2px;
  }
  @media (max-width: 360px) {
    left: 6px;
    bottom: -33px;
  }
`;

export const ListOptions = styled.div`
  margin: 5% 0;
  width: 100%;
`;

export const ItemList = styled.h2`
  margin: 2px auto;
  padding: 3% 0;
  cursor: pointer;
  display: block;
  font-size: 5.5em;
  width: 100%;
  display: block;
  text-align: center;
  transition: all 0.4s ease;
  font-family: ${ConfigsGlobal.main_font} ;
  text-shadow: 3px -2px 18px #f3df535c;
  &:hover {
    transform: scale(0.7);
  }
  a {
    text-decoration: none;
    color: #ffffff;
  }
`;

export const CounterBattle = styled.button`

  background: url('${PathMainMenu}battle_pass_button.png') no-repeat left top;
  width: 245px;
  height: 200px;
  position: absolute;
  outline: none;
  border: 0;
  bottom: -4vh;
  right: -2vw;
  background-size: contain;
  @media (max-width: 650px) {
    width: 120px;
    height: 105px;
  }
  span {
    position: absolute;
    bottom: 25px;
    z-index: 3;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    background: #49283d;
    color: #ffffff;
    right: 0;
    font-weight: bold;
    font-size: 30px;
    border: 2px solid #ffffff;
    border-radius: 100%;
    @media (max-width: 650px) {
      width: 30px;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
    }
  }
`;

export const BackgroundHeader = styled.div`
  width: 100vw;
  position: relative;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${ButtonVolume} {
    position: absolute;
    top: 24px;
    right: 28px;
  }
`;

export const BackgroundFooter = styled.footer`
  width: 100vw;
  background-color: yellow;
  background: url(${PathMainMenu}backgroundFooter.png) center top no-repeat;
  position: relative;
  padding: 0 20px;
  display: flex;
  min-height: 150px;
  justify-content: space-between;
  align-items: flex-end;
`;

export const CoinsBox = styled.div`
  background: url(${PathMainMenu}coins_container.png) center top no-repeat;
  position: absolute; 
  top: 0;
  left: 0; 
  right: 0; 
  margin-left: auto; 
  margin-right: auto;
  background-size: cover;
  padding: 5px 70px;
  font-size: 4em;
  border-radius: 0 0 6px 6px;
  display: flex;
  justify-content: space-between;
  min-width: 150px;
  align-items: center;
  color: #fab62e;
  background-color: #00000066;
  box-shadow: -1px 0px 3px #673ab75c;
  @media (max-width: 650px) {
    padding: 10px;
    font-size: 23px;
    max-width: 130px;
  }
  &:before {
    content: '';
    display: block;
    width: 30px;
    height: 30px;
    background: url(${PathMainMenu}coinsIcon.png) no-repeat center center;
    background-size: contain;
  }
  .button-coin {
    content: '';
    display: block;
    width: 30px;
    height: 30px;
    background: url(${PathMainMenu}button_add_coins.png) no-repeat center center;
    background-size: contain;
  }
`;

export const TitleGlow = styled.h2`

  font-size: 2.6em;
  text-transform: uppercase;
  font-family: ${ConfigsGlobal.main_font};
  color: #ffffff;
  display: block;
  text-align: center;
  line-height: 1.1;
  margin: 5px 0;
  letter-spacing: 2px;
  text-shadow: 0px 1px 2px #00000085;
  span {
    font-size: 1.5rem;
    display: block;
  }

`;

export const ButtonGradient = styled.button`

  width: 100%;
  height: 60px;
  border-radius: 8px;
  border: 3px solid #636363;
  position: relative;
  outline: none;
  max-width: 150px;
  overflow: hidden;
  ${props => props.success ? `background: #6eac0a` : `background: #18bac5`};
  ${props => props.glow ? 'box-shadow: 1px 1px 14px 4px inset #0c0c0c, -1px 0px 9px #e37805a3' : 'box-shadow: 1px 1px 14px 4px inset #0c0c0c'};
  transition: all 0.4s ease;
  &:focus, &:active {
    background: #3a1a56;
    box-shadow: 1px 2px 20px 7px inset #000000;
  }
  span {
    font-family: ${ConfigsGlobal.main_font};
    font-size: 28px;
    color: #ffffff;
    text-shadow: 1px 0px 7px #00000054;
  }
  &:after {
    width: 70%;
    max-width: 100px;
    position: absolute;
    bottom: 0;
    height: 3px;
    left: 0;
    right: 0;
    border-radius: 6px 6px 0 0;
    margin: auto;
    background: orange;
    ${({ noborder }) => !noborder && `content: ''`};
  }
  ${({ size }) => size === 'small'
    && `height: 38px; span {
      font-size: 12px;
    }`
  };
`;

export const ButtonGradientBigger = styled(ButtonGradient)`
  span {
    ${({ bigger }) => bigger && `font-size: 36px`};
  }
  ${({ bigger }) => bigger && `max-width: 120px`};
  ${({ bordertop }) => bordertop
    && `
      &:after {
        bottom: initial;
        top: 0;
        background: ${bordertop};
      };
    `
  };
  ${({ glow }) => glow
    && `
      border-color: #f9f4f44d;
    `
  };
`;

export const ButtonGradientMedium = styled(ButtonGradient)`
  
height: 48px;

  span {
    font-size: 20px;
  }
  ${({ bordertop }) => bordertop
    && `
      &:after {
        bottom: initial;
        top: 0;
        background: ${bordertop};
      };
    `
  };
  
  
  
`;

export const ContainerCenterDefault = styled.div`
  margin: 0 auto;
  width: 90%;
  display: block;
  text-align: center;
  position: relative;
`;


export const TitleHeaderGlow = styled.div`
  position: relative;
  z-index: 5;
  text-align: center;
  .title {
    font-family: ${ConfigsGlobal.main_font};
    text-transform: uppercase;
    color: #ffffff;
    font-size: 2.7em;
    font-weight: 400;
    margin: 0;
    line-height: 1;
    margin-bottom: 0;
    letter-spacing: 2px;
    text-shadow: 0px 0px 15px #dc8aff;
    @media (max-height: 480px and max-width: 500px) {
      font-size: 2em;
    }
  }
  .ico {
    margin: 0;
    display: block;
    width: 70px;
    @media (max-height: 480px) {
      width: 20%;
    }
  }
`;

export const GlobalStyle = createGlobalStyle`

  font-family: ${ConfigsGlobal.main_font};
  font-size: 10px;
  padding: 0;
  margin: 0;
  overflow: hidden;

  * {
    -webkit-touch-callout: none;
    -webkit-user-select: none; /* Disable selection/Copy of UIWebView */
  }

  ::-webkit-scrollbar {
    width: 33px;
    height: 33px;
  }

  ::-webkit-scrollbar-thumb {
    background: url('images/ui/location/scrollbar_drag.png') no-repeat left top transparent;
    border-radius: 10px;
    background-size: contain;
  }

  ::-webkit-scrollbar-track {
    background: #2d2533;
    border: 0px none #f7f7f7;
    border-radius: 39px;
  }
  ::-webkit-scrollbar-track:hover {
    background: #2d2533;
  }
  ::-webkit-scrollbar-track:active {
    background: #43374c;
  }
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
  .view {
    padding-bottom: 25px;
    box-sizing: border-box;
    padding-right: 20px;
  }
  .track-vertical {
    width: 15px !important;
    height: 80% !important;
    top: 5%;
    background: red;
    position: absolute;
    right: 10px;
    bottom: 0;
    margin: auto;
    border-radius: 10px;
    background: #2d2f2f;
  }
  .thumb-vertical {
    position: relative;
    display: block;
    width: 100%;
    border-radius: 10px;
    transform: translateY(0px);
    background: url(images/ui/location/scrollbar_drag.png) no-repeat center center #1792a4;
    background-size: 100%;
    width: 25px !important;
    left: -6px;
  }
`

export const BackButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background: url(images/ui/general_shared_items/button_back.png) no-repeat left top;
  background-size: contain;
  box-shadow: none;
  border: 0;
  outline: none;
`;

export const ForwardButton = styled(BackButton)`
  transform: rotate(180deg);
`;

export const TitleFire = styled.h1`
  font-family: ${ConfigsGlobal.secondary_font};
  font-size: 4em;
  line-height: 1;
  letter-spacing: 1.5px;
  color: #ffbb0f;
  text-shadow: 0px 0px 12px #d6481d, 2px 3px 3px #F44336;
  transform: rotate(-3deg);
`;

export const ButtonCircle = styled.button`
  border-radius: 100%;
  display: flex;
  justify-content: center;
  background: transparent;
  align-items: center;
  border: 0;
  outline: none;
  .ico {
    width: 45px;
    height: 45px;
    object-fit: contain;
  }
`;


export const BarCapacity = styled.div`
    width: 100%;
    height: 35px;
    border-radius: 5px;
    border: 4px solid #ffffff70;
    background: ${colors.primary.dark};
    position: relative;
    margin: 3px 0 0;
    box-sizing: border-box;
    img.goldIcon {
      width: 74px;
      position: absolute;
      left: -35px;
      bottom: -20px;
    }
    label {
        width: 100%;
        height: 100%;
        display: flex;
        position: absolute;
        font-size: 1.4em;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        text-shadow: 0px 1px 1px black
    }
`

export const PctCapacity = styled.div`
    width: ${props => props.pct}%;
    height: 100%;
    background: orange;
    transition: width 3s ease-in;
    background: linear-gradient(to bottom, #e79c0f, #ffc70a);
    box-shadow: 1px -1px 5px 8px #FF9800 inset;
`

export const ContainerSuccess = styled.div`
  padding: 30px 10%;
  border-top: 7px solid #809c00;
  min-height: 90vh;
  text-align: center;
  margin: 0 -60px;
  box-sizing: border-box;
  border-bottom: 7px solid #809c00;
  ${props => props.color && `border-color: ${props.color}`};


  ${props => props.center && `
    justify-content: center;
    align-items: center;
    display: flex;`
  };


  .goldIcon {
    width: 65px;
  }

  .normal {
    font-size: 25px;
  }

  .small {
    font-size: 15px;
  }

  .whiteLabel{
    color: white;
  }
  .goldenLabel {
    color: #FAA800;
  }
  .purpleLabel {
    color: #74459D;
  }


  .doubleCoinsArea{
    width: 280px;
    height: 155px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(images/ui/pop_up_complete/PopUpCompleteDoubleOffer.png);
    background-size: 280px;
    background-repeat: no-repeat;
    margin: 0 auto;

    .goldenLabel {
      width: 100%;
      font-size: 21px;
      margin-right: 55px;
      margin-top: 33px;
      margin-bottom: 25px;
    }

    button {
      height: 54px;
      position: relative;
      bottom: 18px;
      max-width: 200px;
    }
  }

  .title {
    width: 80%;
    display: block;
    animation: ${Pullse} 1.2s infinite;
    margin: 0 auto 0%;
  }
  .multiplierText {
    text-transform: uppercase;
    color: #fca104;
    font-size: 3em;
    margin: 2px 0;
  }

  .rewardDetail {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    &:not(:first-child) {
      margin-top: -25px;
    }

    .blockOne {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin-right: -5px;
      }
      span {
        min-width: 80px;
      }
    }

    

  }

  .dividerImg,.centerContent {
    width: 80%;
  }
  .centerContent {
    margin: 0 auto;
    text-align: left;
  }

  .icon {
    width: 100px;
    object-fit: contain;
    height: 100px;
  }
  .lot-text {
    text-transform: uppercase;
    color: ${colors.primary.normal};
    font-size: 3em;
    margin: 2px 0;
    span {
      color: #ffffff;
    }
  }
  ${BarCapacity} {
    width: 60%;
    margin: 0 auto;
    border: 4px solid #ffffff0f;
    margin: 20px auto;
    font-size: 16px;
  }
`;

export const ButtonBuy = styled.button`
  border-radius: 10px;
  height: 55px;
  text-align: center;
  color: #ffffff;
  outline: none;
  font-size: 16px;
  box-shadow: 1px 1px 10px 5px inset #2323238c;
  min-width: 120px;
  background: green;
  display: flex;
  align-items: center;
  font-family: ${ConfigsGlobal.main_font} ;
  text-transform: uppercase;
  flex-direction: column;
  justify-content: center;
  background-image: radial-gradient(#70ae0a,#4c7502);
  border: 3px solid #0000004d;
  &:hover, &:focus, &:active {
    background-image: radial-gradient(#4c7502,#70ae0a);
  }
  strong {
    font-size: 20px;
    color: #ffffff;
    font-weight: 400;
  }
  span {
    display: block;
    &:before {
      content: '';
      display: inline-block;
      width: 30px;
      height: 30px;
      vertical-align: middle;
      background: url(images/ui/icons_items_all/coins/coins_1.png) no-repeat left top;
      background-size: contain;
    }
  }
`;

export const ButtonEquip = styled.button`
  border-radius: 10px;
  height: 60px;
  text-align: center;
  color: #ffffff;
  outline: none;
  font-size: 22px;
  box-shadow: 1px 1px 9px 3px inset #232323a3;
  min-width: 120px;
  display: flex;
  align-items: center;
  font-family: ${ConfigsGlobal.main_font} ;
  text-transform: uppercase;
  flex-direction: column;
  justify-content: center;
  background: ${colors.secondary.normal};
  border: 3px solid #1d1d1d70;
  transition: all 0.3s ease;
  &:hover, &:focus, &:active {
    box-shadow: 1px 1px 10px 4px inset #232323a3;
    background: ${colors.secondary.dark};
  }
  span {
    display: block;
    &:before {
      content: '';
      display: inline-block;
      width: 30px;
      height: 30px;
      vertical-align: middle;
      background: url(images/ui/icons_items_all/coins/coins_1.png) no-repeat left top;
      background-size: contain;
    }
  }
`;

