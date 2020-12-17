import Item from '../item';
import World from '../world';
import Tool from '../tool';
import ObjectItem from '../object';
import EventsHandler from '../../utils/eventsHandler';
import Sound from '@/stages/game/scripts/core/sound';
import _ from 'underscore';

const PIXI = require("pixi.js");

export default class FragileGlass extends Item {
    constructor(texture, extraData, fliped) {
        super(texture, extraData, fliped);
        this.isObstacle = true;

        

    

        this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
            EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, ({ worldInstance }) => {
                
                // try {
                //     this.collisionShape = this.getCollisionShape();
                //     console.log(this.collisionShape)            
                // } catch (err) {
                //     console.error(err)
                // }
                
                this.sprite.texture = this._texture;


                EventsHandler.subscribe(Tool.EFFECTS.THROWABLE_COLLISION, ({ affectedPos, item }) => {
                    if (item.name === "brick") {



                        var distance = getDistance(affectedPos.x, affectedPos.y, this.gamePosition.x, this.gamePosition.y)
                        var playerPos = worldInstance.player.gamePosition;

                        if (distance === 0 && this.gamePosition.z === playerPos.z) {
                            console.log("getCollisionShape", this.getCollisionShape())

                            worldInstance.sceneryManager.updateMatrix(affectedPos.x, affectedPos.y, playerPos.z, true);
                            worldInstance.sceneryManager.toggleCollisionPolygonEnabled(playerPos.z, this.fovID, false);


                            var glass_breaking = new Sound("glass_breaking", { volume: 0.2 });
                            glass_breaking.play();
                            let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
                            this.sprite.texture = textures["maps/Characters/MainCharacter/TOOLS/glassBreakWindow.png"];
                        }
                    }
                });

                EventsHandler.subscribe(Tool.EFFECTS.LASER_TARGET, ({ affectedPos, item }) => {
                    if (item.name === "laserpen") {
                        var playerPos = worldInstance.player.gamePosition;
                        var distance = getDistance(playerPos.x, playerPos.y, this.gamePosition.x, this.gamePosition.y);
                        if (distance === 1 && this.gamePosition.z === playerPos.z) {


                            worldInstance.sceneryManager.updateMatrix(this.gamePosition.x, this.gamePosition.y, playerPos.z, true);
                            worldInstance.sceneryManager.toggleCollisionPolygonEnabled(playerPos.z, this.fovID, false);



                            if (this.renderable === true) {
                                var glass_breaking = new Sound("glass_breaking", { volume: 0.2 });
                                glass_breaking.play();
                            }
                            //this.renderable = false;
                            let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
                            this.sprite.texture = textures["maps/Characters/MainCharacter/TOOLS/glassBreakWindow.png"];
                        }
                    }
                });

            });
        });
    }


    

}




function getDistance(xA, yA, xB, yB) {
    var xDiff = xA - xB;
    var yDiff = yA - yB;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}