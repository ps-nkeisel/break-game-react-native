import React from 'react';

import Modal from '@/components/modal';
import CustomScroll from '@/components/scrollbox';

import { TitleHeaderGlow, ViewBackground, BackButton, TitleGlow, ButtonGradient } from '@/styles/style';

import { Header, Footer, BoxContainer, BadgeClaim, ButtonBuy } from './styles';
import { FigureItem } from '@/stages/gear/styles';

import { Dispatchers } from '@/store/ducks/modals';
import VolumeControl from '../volumeControl';

export default function SeasonRewardsComponent(props) {
  return (
    <Modal visibility>
      <ViewBackground>
        <Header>
          <TitleHeaderGlow>
            <img alt="Season Rewards" className="ico" src="images/ui/battle_pass/icon_season_rewards.png" />
            <h2 className="title">Season Rewards</h2>
          </TitleHeaderGlow>
          <VolumeControl />
        </Header>
        
        <BoxContainer>
          <CustomScroll proporcional={1.45}>
            <header>
              <h3>Day</h3>
              <ButtonBuy>
                Buy
              </ButtonBuy>
            </header>
            <ul className="list">
              <li className="item-list">
                <div className="number">4</div>
                <BadgeClaim>
                  <div className="xp"> 
                    <span>></span> 500XP
                  </div>
                  <p className="coins">
                    1000 <strong>Coins</strong>
                  </p>
                  <ButtonGradient size="small">
                    <span>Claim</span>
                  </ButtonGradient>
                </BadgeClaim>
                <BadgeClaim gold>
                  <div className="xp"> 
                    <span>> </span> 500XP
                  </div>
                  <FigureItem theme="blue" circle>
                    <img alt="Sky mask" src="images/ui/icons_items_all/hat/sky_mask.png" />
                  </FigureItem>
                </BadgeClaim>
                <BadgeClaim gold>
                  <div className="xp"> 
                    <span>></span> 500XP
                  </div>
                  <p className="coins">
                    1000 <strong>Coins</strong>
                  </p>
                </BadgeClaim>
              </li>
              <li className="item-list">
                <div className="number">4</div>
                <BadgeClaim>
                  <div className="xp"> 
                    <span>></span> 500XP
                  </div>
                  <p className="coins">
                    1000 <strong>Coins</strong>
                  </p>
                  <ButtonGradient size="small">
                    <span>Claim</span>
                  </ButtonGradient>
                </BadgeClaim>
                <BadgeClaim gold disabled>
                  <div className="xp"> 
                    <span>> </span> 500XP
                  </div>
                  <FigureItem theme="blue" circle>
                    <img alt="Sky Mask" src="images/ui/icons_items_all/hat/sky_mask.png" />
                  </FigureItem>
                </BadgeClaim>
                <BadgeClaim gold>
                  <div className="xp"> 
                    <span>></span> 500XP
                  </div>
                  <p className="coins">
                    1000 <strong>Coins</strong>
                  </p>
                </BadgeClaim>
              </li>
            </ul>
          </CustomScroll>
        </BoxContainer>
        <Footer>
          <BackButton onClick={() =>  Dispatchers.closeModals() }/>
          <TitleGlow>
            Buy A Battle Pass
            {' '}
            <small>To Unlock Amazing Rewards!</small>
          </TitleGlow>
        </Footer>
      </ViewBackground>

    </Modal>
  );
}
