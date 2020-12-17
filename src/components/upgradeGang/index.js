import React from 'react';

import Modal from '../modal/index';
import {
  ButtonBuy, ButtonGradientBigger, ViewBackground,
} from '../../styles/style';

import {
  TitleBigger, Container, BoxContainer, ListItems, Item,
} from './styles';

export default function UpgradeGangComponent(props) {
  return (
    <Modal visibility>

      <Container>
        <ViewBackground>
          <BoxContainer>
            <TitleBigger>
              Upgrade your
              <span> Gang</span>
            </TitleBigger>
            <ListItems>
              <Item>
                <img className="ico" src="images/ui/login_pop_ups/message_2/icon_earn_more_coins.png" />
                <p>Earn <span>Coins 20%</span> Faster</p>
                <ButtonBuy>
                  Buy
                  <strong>$2</strong>
                </ButtonBuy>
              </Item>
              <Item>
                <img className="ico" src="images/ui/login_pop_ups/message_2/icon_safebox.png" />
                <p>Earn <span>Coins 20%</span> Faster</p>
                <ButtonBuy>
                  Buy
                  <strong>$2</strong>
                </ButtonBuy>
              </Item>
            </ListItems>
            <ButtonGradientBigger noborder>
              <span>Close</span>
            </ButtonGradientBigger>
          </BoxContainer>
        </ViewBackground>
      </Container>

    </Modal>
  );
}
