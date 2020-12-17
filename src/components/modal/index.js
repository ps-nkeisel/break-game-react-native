import React from 'react';

import { ModalOverlay, ContainerModal, ModalContainer } from './style';

import { connect } from 'react-redux';

const Modal = (props) => {
  
  const { visibility, modeBackground } = props;

  return (

    <ModalContainer
      visibility={ visibility ? 'show' : 'hide'}
    >
      <ModalOverlay modeBackground={modeBackground}>
        <ContainerModal>
          { props.children }
        </ContainerModal>
      </ModalOverlay>
    </ModalContainer>
  );
};


export default connect()(Modal);
