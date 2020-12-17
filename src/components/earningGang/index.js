import React from 'react';

import Modal from '../modal/index';
import {
  ButtonBuy, ButtonGradientBigger, ViewBackground, TitleGlow,
} from '../../styles/style';

import {
  TitleBigger, Header, Container, BoxContainer, Text
} from './styles';

export default function EarningGangComponent(props) {
  return (
    <Modal visibility>

      <Container>

        <Header>
          <TitleGlow>
            Hire More Crew
            {' '}
            <span>
              To Double Earnings Where
              <br />
              {' '}
              you are offline!
            </span>
          </TitleGlow>
        </Header>

        <ViewBackground>
          <BoxContainer>
            <TitleBigger>
              the <span> Gang</span>
            </TitleBigger>
            <Text>Your Gang Earned 
              <strong>3000 Coins</strong>
              While you were gone
            </Text>
            <ButtonGradientBigger glow>
              <span>Get It!</span>
            </ButtonGradientBigger>
          </BoxContainer>
        </ViewBackground>
      </Container>

    </Modal>
  );
}
