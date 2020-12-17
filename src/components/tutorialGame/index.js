import React, { useState } from 'react';

import Modal from '../modal/index';
import {
  ForwardButton,
} from '../../styles/style';
import { Dispatchers } from '../../store/ducks/modals';

import { Container, Slide, ItemSlide } from './styles';
 
export default function TutorialGame(props) {

  const [ currentSlide, setCurrentSlide ] = useState(1);
  const totalSlides = 2;

  function nextSlide(count) {

    if (currentSlide < totalSlides) {
      return currentSlide + 1;
    }
  
    Dispatchers.closeModals();
    
    return currentSlide;

  }

  return (
    <Modal visibility>
      <Container>

        <Slide>
          <ItemSlide active={ currentSlide === 1 }>
            <h3>Walk Around</h3>
            <p>Tap to Move Around The Level and get Inside the Store</p>
          </ItemSlide>
          <ItemSlide  active={ currentSlide === 2 }>
            <h3>Loot Some Items</h3>
            <p>Loot all the Items sorrounded by a white stroke.</p>
            <div className="icon-items">
              <img src="images/ui/tutorial/icon_coins.png" alt="Coins"/>
              <img src="images/ui/tutorial/icon_safebox.png" alt="Safebox"/>
              <img src="images/ui/tutorial/icon_ccard.png" alt="Card"/>
            </div>
          </ItemSlide>
        </Slide>
        
        <ForwardButton onClick={() => setCurrentSlide(nextSlide(currentSlide)) } />
      </Container>
    </Modal>
  );
}
