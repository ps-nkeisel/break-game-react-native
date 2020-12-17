import BaseScript from './base';
import Danger from '../../core/danger';
import World from '../../core/world';
import Store from '@/store';
import Modal from '../../core/modal';

export default class RescueArea extends BaseScript {



    onMovementStart({ moveTo }, event_type, entity, context) {

        var { gameplay } = Store.getState();
        var player = this.getPlayer();


        if (player.gamePosition.z !== 0) return true;


        

        let specialLootPicked = gameplay.backpack.items.find((item) => (
            item.specialLoot
        ))


        var inRescueArea = false;

        let rescueArea = this.sceneryManagerInstance.worldInstance.carEntrace;

        if (rescueArea) {

            var initPos = this.sceneryManagerInstance.sceneryManifests.initPosition;
            if (moveTo.x >= initPos.x - 2 && moveTo.x <= initPos.x + 2) {
                if (moveTo.y >= initPos.y - 1 && moveTo.y <= initPos.y + 2) {
                    inRescueArea = true;
                }
            }
        }



        if (inRescueArea) {
            if (specialLootPicked) {
                player.invisible = true;
                var nearestDanger = this.getNearestDanger()
                if (nearestDanger && nearestDanger.mode === Danger.MODE.CHASING)
                    nearestDanger.addBaloon(2000, "detected");

                this.sceneryManagerInstance.worldInstance.carEntrace.out().then(() => {
                    this.sceneryManagerInstance.worldInstance.eventsHandler.fire(World.EVENTS_HANDLERS.ON_PLAYER_COMPLETE_LEVEL);
                });
            }else {
                if(this.modal === undefined || this.modal === null){
                    this.modal = new Modal(Modal.MODAL_CONTENTS.STEAL_SOMETHING, ()=>{
                        this.modal = null;
                    });
                    this.modal.show();
                }
                
            }
        }
    }
}


