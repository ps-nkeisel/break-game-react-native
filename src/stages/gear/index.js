import React from 'react';

import {
  ViewBackground, ButtonGradientBigger
} from '@/styles/style';
import VolumeControl from '@/components/volumeControl';
import GoBack from '@/components/backButton';
import { FooterLocation, ContainerGray } from '../locations/styles';

import {
  Header, BlockItem, ListItems, FigureItem, DescriptionItem,
} from './styles';
import CustomScrollBar from '../../components/scrollbox';
import ActionAcordion from '../../components/actionAcordion';
import ClockTime from '../../components/clockTime';
import CoinBar from '@/components/coinBar';
import ItemShop from './components/menu/components/itemShop';
import GameService from '@/stages/game/scripts/core/services/GameService'
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _ from 'underscore';

function GearComponent(props) {

  var tools = GameService.getAllItems("Tool");
  var backpack = GameService.getAllItems("Backpack");

  var currentBackpack = GameService.getCurrentPlayerBackpack();
  var nextBackpack = GameService.getNextBackpack();
  
  var currentHat = GameService.getCurrentPlayerHat();
  var nextHat = GameService.getNextPlayerHat();

  const history = useHistory();
  

  function getLatestSceneryAvailable(){
    var sceneries = GameService.getSceneries();
    var unlockedSceneries = _.where(sceneries, {locked:false});
    var baseId =unlockedSceneries[unlockedSceneries.length-1].id;
    history.push('/game/'+baseId);
  }



  return (
    <ViewBackground>
      <Header>
        <CoinBar />
      </Header>
      <ContainerGray>
        <CustomScrollBar>
          <ActionAcordion title="Cosmetics">
            <ListItems>
              <ItemShop item={currentBackpack} upgradeItem={nextBackpack} upgrade={true} />
              <ItemShop item={currentHat} upgradeItem={nextHat} upgrade={true} />
            </ListItems>
          </ActionAcordion>
          <ActionAcordion title="Gadgets" initOpened={true}>
          {
            tools.map(tool => (
              <ItemShop item={tool} key={tool.id}/>
            ))
          }
          </ActionAcordion>
          
          <ActionAcordion
            alt="Limited Time Shop"
            title="Limited Time Shop"
            componentSecondary={<ClockTime />}>

            <ItemShop item={GameService.getItem(37)} upgrade={true}  />
      
          </ActionAcordion>
        
        </CustomScrollBar>
      </ContainerGray>
      <FooterLocation>
        <GoBack onBackButtonClicked={props.onBackButtonClicked} />
        <VolumeControl />
        {
          props.hidePlayerButton !== true ?
            <ButtonGradientBigger onClick={getLatestSceneryAvailable} noborder bigger >
              <span>PLAY</span>
            </ButtonGradientBigger>
            : null
        }
      </FooterLocation>
    </ViewBackground>
  );
}


export default connect((state, ownProps) => ({
  backpackId: state.user.backpackId,
  hatId: state.user.hatId,
  escapeCarId: state.user.escapeCarId
}))(GearComponent)