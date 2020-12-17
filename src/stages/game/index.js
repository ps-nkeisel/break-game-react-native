import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import LevelCompleteComponent from '@/components/levelComplete';
import { ButtonCircle } from '@/styles/style';
import JailComponent from '@/components/JailPopup';
import CoinBar from '@/components/coinBar';
import BackPack from '@/components/backPack';
import VolumeControl from '@/components/volumeControl';
import { MODALS_KEY, Dispatchers } from '@/store/ducks/modals';
import TutorialGameComponent from '@/components/tutorialGame';
import { GameBox, FooterGame, ButtonMenu } from './styles';
import World from './scripts/core/world';
import EventsHandler from './scripts/utils/eventsHandler';
import GearComponent from '@/stages/gear';
import { withRouter } from 'react-router-dom';

function onPlayerCompleteLevel() {
  Dispatchers.setStateModal({
    keyModal: MODALS_KEY.LEVEL_COMPLETED,
    visibility: true,
  });
}

function onPlayerGetCaught() {
  Dispatchers.setStateModal({
    keyModal: MODALS_KEY.JAIL,
    visibility: true,
  });
}



function GameComponent(props) {
  const [isShop, setShop] = useState(false);

  const { modal, match, history } = props;


  function defaultBackButton(){
    history.replace("/locations")
  }

  function PopupGear() {
    return ReactDOM.createPortal((<GearComponent hidePlayerButton={true} onBackButtonClicked={() => {
      setShop(false);
    }} />), window.document.getElementById("uppercanvas"))
  }


  useEffect(() => {

    Dispatchers.closeModals();
    window.gameWorld.onInit(match.params.idMap);

    EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, () => {
      document.getElementById('canvas').style.display = 'block';
    });

    return () => {
      document.getElementById('canvas').style.display = 'none';
      window.gameWorld.destroy();
    }
  }, [match.params.idMap]);

  useEffect(() => {
    var completeLevelEvt = EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_PLAYER_COMPLETE_LEVEL, () => {
      onPlayerCompleteLevel();
    });

    var playerGetCaught = EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_PLAYER_GET_CAUGHT, () => {
      onPlayerGetCaught();
    });

    return () => {
      EventsHandler.unsubscribe(completeLevelEvt);
      EventsHandler.unsubscribe(playerGetCaught);
    }

  }, []);

  useEffect(() => {

    Dispatchers.setStateModal({
      keyModal: MODALS_KEY.TUTORIAL_GAME,
      visibility: false,
    });

  }, []);



  return (

    <>
      {
        isShop ?
          <PopupGear />
          : null
      }
      <div style={{display: isShop ? "none" : null}}>
        <GameBox>
          <CoinBar />
          <ButtonCircle onClick={() => setShop(true)}>
            <img alt="Gear" className="ico" src="images/ui/in_game_UI/button_gear.png" />
          </ButtonCircle>

          <FooterGame>
            <BackPack />
            <div className="buttons">
              <ButtonMenu onClick={defaultBackButton}>
                <img alt="Menu" className="ico" src="images/ui/in_game_UI/button_menu.png" />
              </ButtonMenu>
              <VolumeControl />
            </div>
          </FooterGame>
          {
            modal.visibility && modal.keyModal === MODALS_KEY.LEVEL_COMPLETED
            && (
              <LevelCompleteComponent />
            )
          }

          {
            modal.visibility && modal.keyModal === MODALS_KEY.TUTORIAL_GAME
            && (
              <TutorialGameComponent />
            )
          }

          {
            modal.visibility && modal.keyModal === MODALS_KEY.JAIL
            && (
              <JailComponent />
            )
          }

        </GameBox>
      </div>
    </>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modals.stateModal,
});

export default connect(mapStateToProps)(withRouter(GameComponent));
