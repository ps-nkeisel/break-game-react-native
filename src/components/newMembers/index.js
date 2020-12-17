import React from 'react';

import Modal from '../modal/index';
import {
  ButtonGradientBigger, ViewBackground,
} from '../../styles/style';

import {
  TitleBigger, Container, BoxContainer, ListItems, Text,
} from './styles';

export default function NewMembersComponent(props) {
  return (
    <Modal visibility>

      <Container>
        <ViewBackground>
          <BoxContainer>
            <TitleBigger>
              Hire New <span> Gang </span> Members
            </TitleBigger>
            <ListItems>
              <Text>Get <strong>250 coins </strong> 
              for every friend that joins, and get <strong>10%</strong> of all 
              <strong> Coins</strong> they earn <h3>Forever!</h3>
              </Text>
              <ButtonGradientBigger bordertop="#8bc34a">
                <span>Invite Friends</span>
              </ButtonGradientBigger>
            </ListItems>
            <Text>
              Friends Earnings Share 
              <strong> 250 Coins </strong> <br/>
            </Text>
            <ButtonGradientBigger noborder>
              <span>Close</span>
            </ButtonGradientBigger>
          </BoxContainer>
        </ViewBackground>
      </Container>

    </Modal>
  );
}
