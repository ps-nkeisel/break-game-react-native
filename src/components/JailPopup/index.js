import React, { useState } from 'react';
import { connect } from 'react-redux';
import Modal from '../modal/index';
import {
  ContainerSuccess, ButtonGradientBigger,
} from '../../styles/style';
import { Text, ContainerLoots, FooterAction } from './styles';
import BailOutModal from '@/components/bailOutModal';
import { withRouter } from 'react-router-dom';



function JailPopupComponent(props) {

  const [isBailOut, setBailOut] = useState(false);
  const [usedPlayers, setUsedPlayers] = useState([]);
  const [usedContexts, setUsedContexts] = useState([]);


  var { items, worthy, history } = props;
  worthy = Math.round(worthy);

  const rewardCoins = Math.ceil(worthy * 0.25);

  function gotoBack(){
      window.bgSound.play();
      history.goBack();
  }


  if (isBailOut) {
    return <BailOutModal gotoBack={gotoBack} usedContexts={usedContexts} setUsedContexts={setUsedContexts} usedPlayers={usedPlayers} setUsedPlayers={setUsedPlayers} coins={worthy} visibility={true} onBackPressed={() => setBailOut(false)} />
  }

  return (
    <Modal visibility>
      <ContainerSuccess color="#f28403">
        <img alt="Jail" className="title" src="images/ui/in_game_UI/pop_up_jail/label_jail.png" />

        <Text>
          If you go to jail, you will loose all the loot collected
        </Text>
        <ContainerLoots>
          <h4 className="counter">
            Loot
                  <span style={{ marginLeft: "5px" }}>{items.length}</span>
          </h4>
          <p>
            Total Worth
                  {' '}
            <strong>{worthy} Coins</strong>
          </p>
        </ContainerLoots>




        <FooterAction>

          <ButtonGradientBigger
            bordertop="#ff8600"
            onClick={gotoBack}
          >
            <span>Go To Jail</span>
          </ButtonGradientBigger>

          {
            worthy > 0 ?
              <ButtonGradientBigger bordertop="#8bc34a" onClick={() => setBailOut(true)} >
                <span>Ask for Bail</span>
                <span style={{ position: "absolute", fontSize: "9px", left: "37px", top: "32px", color: "white" }}>
                  GET {rewardCoins} COINS
                </span>
              </ButtonGradientBigger>
              : null
          }

        </FooterAction>
      </ContainerSuccess>
    </Modal>
  );
}

const mapStateToProp = state => ({
  items: state.gameplay.backpack.items,
  worthy: state.gameplay.backpack.worthy,
});
export default connect(mapStateToProp)(withRouter(JailPopupComponent))