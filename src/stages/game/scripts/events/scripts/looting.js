import { ease } from 'pixi-ease';
import BaseScript from './base';
import Player from '../../core/player';
import Sound from '../../core/sound';
import { transformGamePositionToCoord } from '../../utils/matrix';
import _ from 'underscore';

const PIXI = require("pixi.js");




export default class Looting extends BaseScript {

    constructor(sceneryManagerInstance) {
        super(sceneryManagerInstance);

        this.sound = new Sound("getLoot", {
            volume: 1
        });
        this.soundCoins = new Sound("getCoins", {
            volume: 1
        });
        this.mainItemPicked = new Sound("mainItemPicked", {
            volume: 1
        });
    }

    onMovementStart({ moveTo }, event_type, entity, context) {

        var lootingItems = this.getRegisteredItems({ lootable: true });
        lootingItems = lootingItems.filter((item) => (item.took === false));


        lootingItems.forEach(item => {
            var itemPos = item.gamePosition;
            var player = this.getPlayer();

            if (item.gamePosition.z === player.gamePosition.z) {

                if (this.getDistance(moveTo.x, moveTo.y, itemPos.x, itemPos.y) < 2 && !item.took) {
                    
                    item.took = true
                    var playerPos = this.getPlayerPosition();
                      
                    try {
                        if (item.specialLoot){
                            this.mainItemPicked.play();
                        }
                        else if (item.isCoins)
                            this.soundCoins.play(true);
                        else
                            this.sound.play(true);
                    } catch (error) {
                        this.sound.play(true);
                    }

                    
                    if (item.specialLoot){
                        player.holdItem(item);
                        let animation = ease.add(item.highlightFrame, { scale: 0.2, alpha: 0 }, {duration: 200});
                        animation.once("complete", () => {
                            item.highlightFrame.renderable = false;
                        });

                        var mainItems = require("@/stages/game/manifests/mainItems.json");
                        let sourceImage = item.extraData.image.source;
                        let mainItem = _.findWhere(mainItems,{texture:sourceImage });
                        this.sceneryManagerInstance.showGotMainItem(mainItem.name);
                    }


                    ease.add(item, { position: transformGamePositionToCoord(playerPos.x, playerPos.y), scale: 0, alpha: 0 }, { duration: player.speed });




                    if (item.isCoins) {
                        var coins_text = new PIXI.Text(
                            "$$",
                            {
                                stroke: "#3d174a",
                                lineJoin: "round",
                                strokeThickness: 1, fontWeight: 500, letterSpacing: 0.5, fontFamily: "MarketDeco", fontSize: 21, fill: '#e7af00'
                            }
                        );
                        coins_text.anchor.set(0.5, 0)
                        coins_text.position.set(0, -38);

                        setTimeout(() => {
                            this.playerInstance.addChild(coins_text);
                            var anim = ease.add(coins_text, { position: { x: 0, y: -60 }, alpha: 0 }, { duration: 1000 });
                            anim.once("complete", () => {
                                coins_text.destroy();
                            });
                        }, player.speed - 60);
                    }

                    let lootingItemsGot = lootingItems.filter((item) => (
                        item.took === true
                    ));

                    var data = { totalLootings: lootingItems.length, gotTotal: lootingItemsGot.length, item: item };
                    this.playerInstance.eventsHandler.fire(Player.EVENTS_HANDLERS.ON_PLAYER_GET_LOOT, data)
                }
            }
        });
    }


    getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

}