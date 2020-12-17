import React from 'react';

import Modal from '../modal/index';

import { ContainerOffer } from './styles';
import { TitleFire, ButtonGradient } from '../../styles/style';
import { Dispatchers } from '../../store/ducks/app';

export default function SpecialOfferComponent(props) {
  return (
    <Modal visibility>
      <ContainerOffer>
        <TitleFire>Special Offer</TitleFire>
        <h2 className="title">
          Do you Want to Buy
          <span> XXXX More Coins</span>
          {' '}
          for
          <br />
          <strong>Just $35?</strong>
        </h2>
        <img src="images/ui/icons_items_all/coins/coins_1.png" alt="Coins" className="ico" />
        <footer className="footer">
          <ButtonGradient noborder success onClick={() => Dispatchers.closeModals()}>
            <span>Yes</span>
          </ButtonGradient>
          <ButtonGradient noborder onClick={() => Dispatchers.closeModals()}>
            <span>Close</span>
          </ButtonGradient>
        </footer>
      </ContainerOffer>
    </Modal>
  );
}
