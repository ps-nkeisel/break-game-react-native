import React from 'react';
import './App.css';
import { Howler } from 'howler';
import { Provider } from 'react-redux';
import { Route, HashRouter } from 'react-router-dom';
import { GlobalStyle } from './styles/style';
import Sound from './stages/game/scripts/core/sound';
import { persistor, store } from './store/index';
import routes from './router';
import { connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Dispatchers } from './store/ducks/user';
import { Dispatchers as DispatchersModal, MODALS_KEY } from './store/ducks/modals';
import GameService from '@/stages/game/scripts/core/services/GameService';
import images from '@/stages/game/manifests/images.json'


function GlobalSoundComponent({ muteState }) {
  Howler.volume(muteState ? 0 : 1);
  return '';
}

const GlobalSoundGame = connect((state) => ({
  muteState: state.app.muted
}))(GlobalSoundComponent);



class App extends React.Component {

  componentDidMount() {
    if (!window.bgSound) {
      window.bgSound = new Sound("gameSound", { volume: 0.3, loop: true });
      window.bgSound.play();
    }


    window.FBInstant.player.getSignedPlayerInfoAsync()
      .then(async function (result) {
        var signature = result.getSignature();

        var playerName = window.FBInstant.player.getName();
        var playerPic = window.FBInstant.player.getPhoto();

        var response = await GameService.registerFacebook(signature, playerName, playerPic)
        let token = response?.data?.token;
        Dispatchers.setApiToken(token);
      });

    let entryData = window.FBInstant.getEntryPointData();
    let ownPlayerName = window.FBInstant.player.getName();


    if (entryData?.action === "bailout") {
      var { coins, uniqId, playerName, photo,playerID} = entryData;

      if (GameService.getTimesPlayed() === 1)
        coins*=2;


      if (GameService.hasRewardedBailout(uniqId)) return false;

      if (playerID === window.FBInstant.player.getID()) return false;
     
      DispatchersModal.setStateModal({
        keyModal:MODALS_KEY.BAILOUT_POPUP,
        visibility: true,
        data: {
          action: "helperGuy",
          coins: coins,
          photo: photo,
          playerID: window.FBInstant.player.getID(),
          playerName: playerName
        }
      });

      Dispatchers.addUserCoins(coins);
      Dispatchers.addRewardBailout(uniqId);
      // TODO - Show a success feedback dialog

      let payload = {
        action: 'CUSTOM',
        cta: {
          default: "Take it",
          localizations: {
            en_US: 'Take it',
            es_LA: 'Tomar',
            pt_BR: 'Pegar'
          }
        },
        text: {
          default: ownPlayerName + ' bailed you out and sent your share!',
          localizations: {
            en_US: ownPlayerName + ' bailed you out and sent your share!',
            es_LA: ownPlayerName + ' te rescató y envió tu parte!',
            pt_BR: ownPlayerName + ' te resgatou e enviou a sua parte!'
          }
        },
        template: 'bail_out_answer',
        data: {
          coins: coins,
          uniqId: uniqId,
          playerName: window.FBInstant.player.getName(),
          photo: window.FBInstant.player.getPhoto(),
          action: "bailout-answer"
        },
        strategy: 'IMMEDIATE_CLEAR',
        notification: 'PUSH',
        image: images.rsz_get_coins
      };

      window.FBInstant.updateAsync(payload).then(function () {
        console.log('POSTADO!!!');
      }).catch(function (error) {
        console.error('Message was not posted: ' + error.message);
      });

      

    } else if (entryData?.action === "bailout-answer") {
      // TODO - Show a success feedback dialog indicating the bail out was accepted 
      const { coins, uniqId, playerName, photo} = entryData;

      if (GameService.hasRewardedBailout(uniqId)) return false;


      DispatchersModal.setStateModal({
        keyModal:MODALS_KEY.BAILOUT_POPUP,
        visibility: true,
        data: {
          action: "prisonerGuy",
          coins: coins,
          playerName: playerName,
          photo: photo
        }
      });
      
      Dispatchers.addUserCoins(coins);
      Dispatchers.addRewardBailout(uniqId);

      console.log("bail out was accepted")

    }

    Dispatchers.incrementPlayedTimes();

  }

  render() {

    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          
          
          


          <GlobalStyle />
          <GlobalSoundGame />
          <HashRouter>
            {
              routes.map((route, key) => (
                <Route
                  path={route.path}
                  component={route.component}
                  exact={route.exact}
                  key={key}
                />
              ))
            }
          </HashRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;