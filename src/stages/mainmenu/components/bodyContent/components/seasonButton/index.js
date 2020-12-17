import React from 'react';

import { CounterBattle } from '../../../../../../styles/style';
import { Dispatchers, MODALS_KEY } from '../../../../../../store/ducks/modals';

function callSeasonRewards() {
  Dispatchers.setStateModal({
    visibility: true,
    keyModal: MODALS_KEY.SEASON_REWARDS,
  });
}

const SeasonButton = () => (
  <>
    <CounterBattle onClick={() => callSeasonRewards()}>
      <span>3</span>
    </CounterBattle>
  </>
);

export default SeasonButton;
