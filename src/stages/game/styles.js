import styled from 'styled-components';

import { ButtonCircle, CoinsBox } from '@/styles/style';

export const HeaderGame = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  position: fixed;
  z-index: 400;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  padding: 15px;
  justify-content: center;
  ${ButtonCircle} {
    position: absolute;
    top: 20%;
    right: 10px;
  }
`;

export const FooterGame = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  position: fixed;
  z-index: 400;
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 70px;
  padding: 0 5px;
  background: rgba(0,0,0,0.95);
  border-top: 4px solid #464545;
  justify-content: space-between;
  .buttons {
    flex: 0.5;
    display: flex;
    margin-top: 5px;
    align-items: center;
    ${ButtonCircle} {
      .ico {
        width: 48px;
        height: 48px;
      }
    }
  }
`;

export const ButtonMenu = styled(ButtonCircle)`
  position: relative;
`;

export const GameBox = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  top: -80px;
  padding: 0;
  margin: 0;
  ${CoinsBox} {
    position: fixed;
    right: 0;
    z-index: 10;
    top: 0;
    margin: auto;
    left: 0;
    max-width: 90px;
  }
  ${ButtonCircle} {
    right: 0;
    z-index: 10;
    top: 50px;
    margin: auto;
    position: fixed;
  }
  ${ButtonMenu} {
    position: inherit;
  }
`;

