import React from 'react';

import { ContainerCounter, ProgressBox } from './styles';
import GameService from '@/stages/game/scripts/core/services/GameService';
import { connect } from 'react-redux';

function getPercentageToNextLevel() {
  var xpNeeded = GameService.getXpNeededNextLevel();
  var currentXp = GameService.getCurrentExperience();
  return (currentXp/xpNeeded) * 100;
}

function SeasonProgressComponent(props) {

  const user = props.user;

  return (
    <div className="containerBox">
      <h4>Season Progress</h4>
      <ContainerCounter>
          <ProgressBox porcentage={getPercentageToNextLevel()}>
              <div className="line"></div>
          </ProgressBox>
          <h2 className="counter">{user.level}</h2>
      </ContainerCounter>  
    </div>
  );  
}

const mapStateToProps = (state) => ({
  user: state.user,
});


export default connect(mapStateToProps)(SeasonProgressComponent)
