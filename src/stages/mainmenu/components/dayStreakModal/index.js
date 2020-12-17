import React from 'react';

import Modal from '@/components/modal';
import { connect } from 'react-redux';

import { ButtonGradient } from '@/styles/style';
import { Dispatchers, MODALS_KEY } from '@/store/ducks/modals';
import {
  ContainerLoginStreak, ContainerActionModal, CounterStone, BoardSilver, Header, Title
} from './styles';

function DayStreakModal(props) {
  const { visibility, days, name, multiplier, texture, value, type, toolId } = props;

  function getItAction() {
    Dispatchers.closeModals();

    setTimeout(() => {
      Dispatchers.setStateModal({
        keyModal: MODALS_KEY.TOMORROW_REWARD,
        visibility: true,
        days: days,
        name: name,
        multiplier: multiplier,
        texture: texture,
        value: value,
        type: type,
        toolId : toolId
      });
    }, 1000);
  }

  return (
    <>
      <Modal visibility={visibility} modeBackground="background">
        <Header>
          <Title>
            Play Every Day
            {' '}
            <span>To Get Better Prizes!</span>
          </Title>
        </Header>
        <ContainerLoginStreak>
          <p className="daycount">Day {days}</p>
          <ContainerActionModal>
            <div className="containerDiamond">
              <img className="icon" alt={name} src={texture} />
            </div>
            <ButtonGradient onClick={getItAction} glow>
              <span>Get It</span>
            </ButtonGradient>
            <CounterStone>
              <span>{multiplier}x</span>
              {' '}
              {name}
            </CounterStone>
          </ContainerActionModal>
          <BoardSilver>
            <p>
              Login Tomorrow Again to Earn
              <strong>Amazing Rewards</strong>
            </p>
          </BoardSilver>
        </ContainerLoginStreak>
      </Modal>
    </>

  );
}

export default connect()(DayStreakModal);
