import React, { useState } from 'react';

import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import GoBack from '@/components/backButton';
import Modal from '@/components/modal';
import {
  ViewBackground, ButtonGradientBigger, TitleHeaderGlow,
} from '@/styles/style';
import VolumeControl from '@/components/volumeControl';
import CustomScrollBar from '@/components/scrollbox';
import { MODALS_KEY, Dispatchers } from '@/store/ducks/modals';
import _ from 'underscore';
import CoinBoxComponent from '@/components/coinBar';


import {
  ContainerGray,
  FooterLocation,
  ViewMode,
  ButtonGrid,
  ScrollListScenaries,
  GridCenaries,
  Header,
  ItemGrid,
  ContainerLocked,
} from './styles';

import SceneryBox from './components/sceneryBox';
import GameService from '@/stages/game/scripts/core/services/GameService'
import SeasonProgressComponent from '@/components/seasonProgress';




export function LocationComponent(props) {

  const history = useHistory();

  const [modeView, setModeView] = useState('column');

  const { modal } = props;

  const changeModeView = (mode) => (
    setModeView(mode)
  );

  function onBackButtonClicked() {
    history.replace("/");
  }

  function getLatestSceneryAvailable() {
    var sceneries = GameService.getSceneries();
    var unlockedSceneries = _.where(sceneries, { locked: false });

    var baseId = unlockedSceneries[unlockedSceneries.length - 1].id;

    history.push('/game/' + baseId);
  }


  const loadAllScenaries = () => {
    var sceneries = GameService.getSceneries();

    return sceneries.map((scenary, index) => {
      if (scenary.id === "devMap" && window.fbEnv === true)
        return true;

      return (
        <ItemGrid key={index}>
          <SceneryBox scenary={scenary} index={index} />
        </ItemGrid>
      );

    });

  };
  console.log("STATE", modal)
  return (
    <>

      <ViewBackground>
        <Header>
          <VolumeControl />
          <TitleHeaderGlow>
            <img alt="Location" className="ico" src="images/ui/location/icon_location.png" />
            <h2 className="title">Location</h2>
          </TitleHeaderGlow>
        </Header>
        {/* <SeasonProgressComponent /> */}
        <ContainerGray>
          <ViewMode>
            <span>View Mode</span>
            <ButtonGrid active={modeView === 'row'} grid="row" onClick={() => changeModeView('row')} />
            <ButtonGrid active={modeView === 'column'} grid="column" onClick={() => changeModeView('column')} />
          </ViewMode>
          <CustomScrollBar>
            <ScrollListScenaries>
              <GridCenaries type={modeView}>
                {loadAllScenaries()}
              </GridCenaries>
            </ScrollListScenaries>
          </CustomScrollBar>
        </ContainerGray>
        <FooterLocation>
          <GoBack onBackButtonClicked={onBackButtonClicked} />
          <ButtonGradientBigger
            noborder
            bigger
            onClick={getLatestSceneryAvailable}>
            <span>PLAY</span>
          </ButtonGradientBigger>
        </FooterLocation>

        {modal.keyModal === MODALS_KEY.REQUIRED_TOOLS && modal.visibility && (
          <Modal visibility={modal.visibility}>
            <ContainerLocked>
              <img src="images/ui/location/icon_locked.png" className="ico" alt="Locked" />
              <h1>TOOL REQUIRED</h1>
              <p>
                You need to have<br /> <br />
                <b>{modal.message}</b><br /> <br />
              to proceed to this level
            </p>
              <ButtonGradientBigger
                noborder
                onClick={() => Dispatchers.closeModals()}
              >
                <span>Close</span>
              </ButtonGradientBigger>
            </ContainerLocked>
          </Modal>
        )}


        {modal.keyModal === MODALS_KEY.LOCKED && modal.visibility && (
          <Modal visibility={modal.visibility}>
            <ContainerLocked>
              <img src="images/ui/location/icon_locked.png" className="ico" alt="Locked" />
              <h1>Level is Locked</h1>
              <p>
                Complete Previous
              <br />
                {' '}
              Levels First To Unlock
              <br />
                {' '}
              New Ones!!!
            </p>
              <ButtonGradientBigger
                noborder
                onClick={() => Dispatchers.closeModals()}
              >
                <span>Close</span>
              </ButtonGradientBigger>
            </ContainerLocked>
          </Modal>
        )}
      </ViewBackground>
      <CoinBoxComponent/>

    </>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modals.stateModal,
});

export default connect(mapStateToProps)(LocationComponent);
