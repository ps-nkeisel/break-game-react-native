import React from 'react';
import { connect } from 'react-redux';
import Modal from '@/components/modal';
import { ButtonGradient } from '@/styles/style';
import { Dispatchers } from '@/store/ducks/modals';
import { TitlePulse, ContainerDiamond, DiamondCircle, Container } from './styles';
import { Dispatchers as DispatchersUser} from '@/store/ducks/user';
//import Store from '@/store';
//Store.getState().user.coins

function TomorrowRewardComponent(props) {
  console.log(props);
  const { visibility, texture, value, type, toolId } = props;

  return (
    <>
      <Modal visibility={visibility}>
        <Container>
          <TitlePulse src="images/ui/popup_reward_adquired/label_reward_adquired.png" />
          <ContainerDiamond>
            <DiamondCircle>
              <img alt="icon_stone" className="ico" src={texture} />
            </DiamondCircle>
          </ContainerDiamond>
          <ButtonGradient noborder onClick={() => {
            if(type === "coins"){
              if (value)
                DispatchersUser.addUserCoins(value);
            }else{
              if (toolId && value)
                DispatchersUser.addUserInventory(toolId, value);
            }
            Dispatchers.closeModals();
          }}>
            <span>OK</span>
          </ButtonGradient>
        </Container>
      </Modal>
    </>

  );
}

export default connect()(TomorrowRewardComponent);
