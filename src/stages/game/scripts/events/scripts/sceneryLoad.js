import BaseScript from './base';
import World from '../../core/world';
import Store from '@/store';
import { Dispatchers as DispatchersUser } from '@/store/ducks/user';
import { Dispatchers as DispatchersGameplay } from '@/store/ducks/gameplay';

import EventsHandler from '@/stages/game/scripts/utils/eventsHandler';
import ads from '@/stages/game/scripts/core/ads';


export default class SceneryLoad extends BaseScript {



    onSceneryLoaded(data, event_type, entity, creature) {
        this.precifyLoots();

  
        let idScenery = Store.getState().gameplay.scenary_manifest.id;
        DispatchersUser.addSceneryPlayed(idScenery)


        this.restartMainItemHighlight();

        this.preLoadAds();
    }

    preLoadAds() {


        var completingAd = ads.completingScreen.onLoad;
        
        //if (Math.random() <= 0.5)
        //    completingAd.load();
       
        EventsHandler.subscribe([World.EVENTS_HANDLERS.ON_PLAYER_COMPLETE_LEVEL, World.EVENTS_HANDLERS.ON_PLAYER_GET_CAUGHT], (type) => {
            if (!completingAd) return true;

           // console.log("completingAd",completingAd)
            //return;

            
            if (Math.random() * 100 < 30){
                completingAd.show()
                    .then(function () {
                        // Perform post-ad success operation
                        console.log('Interstitial ad finished successfully');
                    })
                    .catch(function (e) {
                        console.error(e.message);
                    });
            }
            

        });

    }


    restartMainItemHighlight() {
        var lootingItems = this.getRegisteredItems({ lootable: true });
        var mainItem = lootingItems.find((item) => (item.specialLoot === true));
        if (mainItem) {
            mainItem.highlightFrame.scale.set(1);
            mainItem.highlightFrame.alpha = 1;
            mainItem.highlightFrame.renderable = true;
        }
    }



    precifyLoots() {

        var mapManifest = this.sceneryManagerInstance.sceneryManifests;
        var lootingItems = this.getRegisteredItems({ lootable: true }, false);
        var maxLootValue = mapManifest.maxLootValue;

        DispatchersGameplay.setGameplayTotalLoots(lootingItems.length)

        lootingItems.forEach(item => {
            item.baseWorthy = item.baseWorthy ?? (item.extraData.properties.baseWorthy ?? 10);
        });

        var totalBaseWorthy = lootingItems.reduce((s, f) => {
            return s + f.baseWorthy;
        }, 0);

        lootingItems.forEach(item => {
            if (item.specialLoot) {
                this.specialLoot = item;
            }
            let worthyFraction = (item.baseWorthy / totalBaseWorthy);
            let worthy = (worthyFraction * maxLootValue);
            item.worthy = worthy;
        });

    }
}