import styled from 'styled-components';

export const ModalOverlay = styled.div`

  background: ${props => props.modeBackground ? 
  'url(images/ui/general_shared_items/background_general.png) no-repeat left top !important' : 'rgba(0,0,0, 0.8)'};
  height: 100vh;
  width: 100%;
  padding: 0;
  box-sizing:border-box;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const ContainerModal = styled.div`
  display: block;
  height: 100vh;
  width: 100%;
  position: relative;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  z-index: 10000;
  overflow-x: hidden;
  transform:scale(1);
  animation: ${(props) => (props.visibility === 'show' ? 'none' : 'quickScaleDown 0s .5s linear forwards')};
  opacity: ${(props) => (props.visibility === 'show' ? '1' : '0')};
  background: #00000096;
  ${ModalOverlay} {
    animation: ${(props) => (props.visibility === 'show'
    ? 'fadeIn .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
    : 'fadeOut .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards')
}
  }
  ${ContainerModal} {
      transform:translateX(-1500px);
      animation: ${(props) => (props.visibility === 'show'
    ? 'roadRunnerIn .3s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards'
    : 'roadRunnerOut .3s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards')
}
  }
`;
