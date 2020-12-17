/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { ViewBackground } from '@/styles/style';

import SeasonRewardsComponent from '@/components/seasonRewards';

import { MODALS_KEY, Dispatchers } from '@/store/ducks/modals';
//import { Dispatchers } from '@/store/ducks/app';
import Header from './components/header';
import TomorrowReward from './components/dayStreakModal/components/tomorrowReward';
import Footer from './components/footer';
import DayStreakModal from './components/dayStreakModal';

import BailOutPopup from './components/bailoutPopup';

import BodyContent from './components/bodyContent';
import GameService from '@/stages/game/scripts/core/services/GameService';
import _ from 'underscore';
import CoinBoxComponent from '@/components/coinBar';

function resolverComponentModal(modal) {
  if (!modal.visibility) return false;

  let component = null;

  switch (modal.keyModal) {
    case MODALS_KEY.DAY_STREAK:
      component = <DayStreakModal visibility {...modal} />;
      break;
    case MODALS_KEY.SEASON_REWARDS:
      component = <SeasonRewardsComponent visibility />;
      break;
    // case MODALS_KEY.DAY_STREAK:
    //   component = <TomorrowReward visibility {...modal} />;
    //   break;
    case MODALS_KEY.BAILOUT_POPUP:
      component = <BailOutPopup visibility {...modal} />
      break;
    default:
  }

  return component;
}

function getDayStreakReward(days) {
  var today = new Date();
  let lastDayOfThisMonth = (new Date(today.getFullYear(), today.getMonth() + 1, 0)).getDate();
  if(days === lastDayOfThisMonth) days = 30;
  //days = 30; //forcing just for tests
  var rewards = require("@/stages/game/manifests/daystreak.json");
  let reward = _.findWhere(rewards, { day: days });

  return reward;
}

function Mainmenu(props) {
  const { modal } = props;


  useEffect(() => {

    // Test only
    // Dispatchers.setStateModal({
    //   keyModal:MODALS_KEY.BAILOUT_POPUP,
    //   visibility: true,
    //   data: {
    //     action: "helperGuy",
    //     coins: 500,
    //     photo: "https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=3218674958168582&height=256&width=256&ext=1607791480&hash=AeQ3itKbgQQh0mYBbUg"
    //   }
    // });


    var days = GameService.getConsecutiveLoginsDays();
    if (days > 0) {
      setTimeout(() => {
        let reward = getDayStreakReward(days);
        Dispatchers.setStateModal({
          keyModal: MODALS_KEY.DAY_STREAK,
          visibility: true,
          days: days,
          ...reward
        });
      }, 1500);
    }
  }, []);

  return (
    <>
      <ViewBackground>

        <Header />
        <BodyContent />
        <Footer />

        {
          modal.visibility && (
            resolverComponentModal(modal)
          )
        }

      </ViewBackground>

      <CoinBoxComponent />
    </>
  );
}

const mapStateToProps = (state) => ({
  modal: state.modals.stateModal,
});

export default connect(mapStateToProps)(Mainmenu);
