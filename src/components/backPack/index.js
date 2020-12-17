import React, {  useEffect } from 'react';
import { connect } from 'react-redux';
import Player from '@/stages/game/scripts/core/player';
import EventsHandler from '@/stages/game/scripts/utils/eventsHandler';
import { Dispatchers } from '@/store/ducks/gameplay';
import { ContainerPack, IconBag } from './styles';
import { BarCapacity, PctCapacity } from '@/styles/style';
import { calculatePct } from '@/utils/utils';
import GameService from '@/stages/game/scripts/core/services/GameService';

function goToInit(){
  console.log("Go to init")
  window.gameWorld.moveToInit();
}

function BackPackComponent(props) {


  const { backpackId, ocupationCurrent, totalLoots } = props;
  var backpackIcon = GameService.getItem(backpackId).texture_shop;

  useEffect(() => {
    var event = EventsHandler.subscribe(Player.EVENTS_HANDLERS.ON_PLAYER_GET_LOOT, ({ totalLootings, gotTotal, item }) => {
        Dispatchers.incrementItemBackPack(item);
    });
    return ()=> EventsHandler.unsubscribe(event)
  }, [totalLoots])

  return (
    <ContainerPack>
      <IconBag onClick={()=>goToInit()} src={backpackIcon} />
      <div className="block" >
        <span>Backpack Capacity</span>
        <BarCapacity>
          <label>{ocupationCurrent}/{totalLoots} Items</label>
          <PctCapacity pct={calculatePct(ocupationCurrent, totalLoots)} />
        </BarCapacity>
      </div>
    </ContainerPack>
  )
}

const mapStateToProp = state => ({
  backpackId: state.user.backpackId, 
  ocupationCurrent: state.gameplay.backpack.items.length,
  totalLoots: state.gameplay.totalLoots,
});
export default connect(mapStateToProp)(BackPackComponent)