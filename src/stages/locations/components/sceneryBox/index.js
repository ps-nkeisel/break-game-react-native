import React from 'react';
import { useHistory } from 'react-router-dom';
import GameService from '@/stages/game/scripts/core/services/GameService';
import { connect } from 'react-redux';
import { Dispatchers, MODALS_KEY } from '@/store/ducks/modals';
import { ContainerCenarie, Picture } from './styles';
import DifficultyBar from './components/difficultyBar';
import StarLevelComponent from '@/components/starLevel';
import _ from 'underscore';

function SceneryBox(props) {
  
  const { scenary, index, sceneriesCompleted } = props;
  const history = useHistory();


  var completedInfo = _.findWhere(sceneriesCompleted, {id: scenary.id});
  var stars = completedInfo ? completedInfo.stars : 0;

  GameService.havePlayerRequiredTool(scenary.id)


  const openAction = () => {

    let havePlayerRequiredTool = GameService.havePlayerRequiredTool(scenary.id)

    if (scenary.locked) {
      Dispatchers.setStateModal({
        visibility: true,
        keyModal: MODALS_KEY.LOCKED
      });
    } 
    else if (!havePlayerRequiredTool.result){


      Dispatchers.setStateModal({
        visibility: true,
        keyModal: MODALS_KEY.REQUIRED_TOOLS,
        message: havePlayerRequiredTool.neededToolsMessage
      });
    }
    else {

      Dispatchers.closeModals();

      history.push('/game/'+scenary.id);
    }
  };
  
  return (
    <>
      <ContainerCenarie locked={scenary.locked} onClick={() => openAction()}>
        {
          !scenary.locked && (
            <StarLevelComponent levelTotal={3} levelCurrent={stars} styling="block"/>
          )
        }
        <Picture src={"images/ui/location/levels_thumbs/"+ scenary.thumb} />
        <footer className="footer">
          <span className="number">{ index + 1}</span>
          <div className="text">
            <h3 className="title">{ scenary.name }</h3>
            <DifficultyBar difficulty={scenary.difficult} />
          </div>
        </footer>
      </ContainerCenarie>
    </>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modals.stateModal,
  sceneriesCompleted: state.user.sceneriesCompleted
});

export default connect(mapStateToProps)(SceneryBox);
