import React, { useState, useEffect } from 'react';
import GameService from '@/stages/game/scripts/core/services/GameService'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Modal from '../modal/index';
import ads from '@/stages/game/scripts/core/ads';
import {
  ContainerSuccess, BarCapacity, PctCapacity, ForwardButton,
} from '@/styles/style';
import StarLevelComponent from '../starLevel';
import { calculatePct } from '@/utils/utils';
import { Dispatchers } from '@/store/ducks/modals';
import { Dispatchers as UserDispatchers } from '@/store/ducks/user';
import CountUp from 'react-countup';
import {
  ButtonGradientBigger
} from '@/styles/style';

import Sounds from '@/stages/game/scripts/core/sound';

function LevelCompleteComponent(props) {

  const [isCompleteLevel, setForward] = useState(false);
  const [lootBarProgress, setLootbarProgress] = useState(0);
  const [hasRewardAds, setHasRewardAds] = useState(false);
  const [showDoubleCoinsFeedback, setShowDoubleCoinsFeedback] = useState(false);

  var { itemsGot, backpackWorthy, maxLootValue, idScenery, experienceScenery } = props;


  var { stars, starBonusRatio } = GameService.calculateMatchCoins(backpackWorthy, itemsGot, maxLootValue);
  const [multiplier, setMultiplier] = useState(starBonusRatio);



  var coins = Math.round(itemsGot.reduce((accumulator, item) => (
    accumulator + (item.worthy * multiplier)
  ), 0));



  function saveArchievementAndBack() {
    UserDispatchers.addSceneryCompleted(idScenery, stars);
    UserDispatchers.addUserCoins(coins);
    UserDispatchers.addUserExperience(experienceScenery);
    UserDispatchers.setUserLevel(GameService.transformXpIntoLevel());
    setForward(true);
  }

  useEffect(() => {
    setLootbarProgress(calculatePct(coins, maxLootValue * (Math.max(1.5, multiplier)))) // 1.5 is the maximum loot multiplier possible
  
      let sound =  new Sounds("getCoins2",{rate: 1.45,volume: 0.7})
      sound.play();

  }, [coins, multiplier])

  useEffect(() => {
    // Should it have an odd to show?
    setHasRewardAds(true);
  }, []);

  if (isCompleteLevel) {
    window.bgSound.play();
    Dispatchers.closeModals();
    return (
      <Redirect to="/locations" />
    );
  }

  function getRewardDoubleCoin() {
    ads.completingScreen.doubleCoins.show().then(() => {
      setShowDoubleCoinsFeedback(true);
      setHasRewardAds(false);
    })
  }

  function doubleCoinsReward() {
    setShowDoubleCoinsFeedback(false);
    setMultiplier(2);
  }

  return (
    <>


      <Modal visibility>
        <ContainerSuccess>
          <img alt="Level Complete" className="title" src="images/ui/in_game_UI/pop_up_complete/label_level_complete.png" />
          <StarLevelComponent levelCurrent={stars} levelTotal={3} />
          {
            multiplier > 1 ? <p className="multiplierText">MULTIPLIER X{multiplier}</p> : null
          }


          <div>
            <img className={"dividerImg"} src={"images/ui/in_game_UI/pop_up_complete/solid_divider.png"} />
            <div className={"centerContent"}>
              <div className={"rewardDetail"}>


                {
                  multiplier > 1 ? (
                    <>
                      <div className="baseValue">
                        <span className={"whiteLabel normal"}>{Math.round(coins / multiplier)}{" "}

                          {multiplier > 1 ? <span className={"goldenLabel small"}>(X{multiplier})</span> : null}

                        </span>


                      </div>
                      <span className={"purpleLabel normal"}>=</span>
                    </>
                  ) : null
                }

                <span className={"goldenLabel normal"}>{coins} <span className={"whiteLabel normal"}>COINS</span></span>

              </div>


            </div>
            <img className={"dividerImg"} src={"images/ui/in_game_UI/pop_up_complete/dashed_divider.png"} />
          </div>
          <p className="lot-text">
            TOTAL EARNED
        </p>

          <BarCapacity>
            <img className="goldIcon" src="images\ui\pop_up_complete\icon_total_coins.png" />
            <label>
              <CountUp start={0} end={coins} delay={0} duration={4} /><span style={{ position: "relative", left: "5px" }}> Coins</span> </label>
            <PctCapacity pct={lootBarProgress} />
          </BarCapacity>

          <ForwardButton onClick={saveArchievementAndBack} />

          {
            hasRewardAds ?
              <div className={"doubleCoinsArea"}>
                <p className={"goldenLabel"} style={{ width: "100%" }}>DOUBLE YOUR <br />PROFITS</p>
                <ButtonGradientBigger noborder onClick={getRewardDoubleCoin} >
                  <span>WATCH AD</span>
                </ButtonGradientBigger>
              </div>
              : null
          }



        </ContainerSuccess>
      </Modal >
      <Modal visibility={showDoubleCoinsFeedback}>
        <ContainerSuccess center={true}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1 style={{ color: "white", fontSize: "42px" }}>Thank you!</h1>
            <p style={{ color: "white" }}>Click on the button below to get your prize!</p>
            <ButtonGradientBigger noborder onClick={doubleCoinsReward} >
              <span>CLAIM</span>
            </ButtonGradientBigger>
          </div>
        </ContainerSuccess>
      </Modal>
    </>
  );
}

const mapStateToProp = state => ({
  idScenery: state.gameplay.scenary_manifest.id,
  experienceScenery: state.gameplay.scenary_manifest.experience,
  maxLootValue: state.gameplay.scenary_manifest.maxLootValue,
  itemsGot: state.gameplay.backpack.items,
  backpackWorthy: state.gameplay.backpack.worthy,
});
export default connect(mapStateToProp)(LevelCompleteComponent)