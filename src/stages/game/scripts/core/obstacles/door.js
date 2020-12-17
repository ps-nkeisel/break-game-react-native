import Item from '../item';
import World from '../world';
import ObjectItem from '../object';
import EventsHandler from '../../utils/eventsHandler';
import Tool from '../tool';
import Sound from '@/stages/game/scripts/core/sound';
import Danger from '../danger';
import { ease } from 'pixi-ease';

const PIXI = require("pixi.js"),
    { AnimatedSprite, Sprite } = PIXI;

export default class Door extends Item {

    constructor(texture, extraData, fliped) {
        super(texture, extraData, fliped);
        this.rotationOriginal = this.rotation;
        this.isObstacle = true;
        


        this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
            EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, ({ worldInstance }) => {
                
                
                
                
                //this.locked = !this.sceneryManager.hasObjectPropertyAtPosition(pos.x,pos.y,pos.z,{locked:true});
                //this.safe = !this.sceneryManager.hasObjectPropertyAtPosition(pos.x,pos.y,pos.z,{safe:true});
                
                this.locked = !!extraData?.properties?.locked;
                this.safe = !!extraData?.properties?.safe;
                
                worldInstance.sceneryManager.updateMatrix(this.gamePosition.x, this.gamePosition.y, this.gamePosition.z, !this.locked);
                

                if (this.locked) {

                    let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
                    let padlock_texture = textures["maps/Shared Elements/alertsBallon/padlock_icon.png"];
                    let padlock = new PIXI.Sprite(padlock_texture);

                    padlock.anchor.set(0.5);
                    //padlock.scale.set(0.3);
                    padlock.alpha = 0.0;
                    padlock.position.set(16, 16);

                    this.addChild(padlock);
                    this.padlock = padlock;

                    EventsHandler.subscribe(Tool.EFFECTS.LOCKPICKING, ({ affectedPos, item }) => {
                        //this.locked = !!extraData?.properties?.locked;

                        if (item.name === "lockpick" && this.locked === true && this.safe === false) {
                            var playerPos = worldInstance.player.gamePosition;
                            var distance = this.getDistance(playerPos.x, playerPos.y, this.gamePosition.x, this.gamePosition.y);

                            if (distance === 1 && this.gamePosition.z === playerPos.z) {
                                this.locked = false;
                                this.padlock.alpha = 0.0;
                                worldInstance.sceneryManager.updateMatrix(this.gamePosition.x, this.gamePosition.y, playerPos.z, !this.locked);
                            }
                        }else{
                            console.log("NAO_PODE_USAR");
                        } /*else if (item.name == "lockpick" this.locked === false && ){
                            console.log("PODE TRANCAR");
                            var playerPos = worldInstance.player.gamePosition;
                            var distance = this.getDistance(playerPos.x, playerPos.y, this.gamePosition.x, this.gamePosition.y);
                            console.log("DISTANCE "+ distance);
                            if (distance == 1 && this.gamePosition.z == playerPos.z) {
                                this.locked = true;
                                worldInstance.sceneryManager.updateMatrix(this.gamePosition.x, this.gamePosition.y, playerPos.z, !this.locked);
                            }
                        }*/
                    });
                }

                if (this.safe) {
                    this.itemContainer.renderable = true;
                    this.renderable = true;
                    this.locked = true;
                    this.padlock.alpha = 0.0;
                    
                    EventsHandler.subscribe(Tool.EFFECTS.EXPLODE_TARGET, ({ affectedPos, item, done }) => {
                        console.log("CHEGOU??");
                        //this.locked = !!extraData?.properties?.locked;
                        if (item.name === "dynamite" && this.locked === true && this.safe === true) {
                            var playerPos = worldInstance.player.gamePosition;
                            var distance = this.getDistance(playerPos.x, playerPos.y, this.gamePosition.x, this.gamePosition.y);

                            if (distance === 1 && this.gamePosition.z === playerPos.z) {
                                let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.animations;
                                let texture = textures["maps/Characters/MainCharacter/TOOLS/Dynamite Explosion/Comp 1"];

                                let explosion = new AnimatedSprite(texture);
                                explosion.animationSpeed = 0.5;
                                explosion.anchor.set(0.5);
                                explosion.position.set(16,16);
                                explosion.play();

                                this.addChild(explosion)
                                let dynamitesound = new Sound("dynamite", { volume: 1 });
                                dynamitesound.play();


                                this.padlock.alpha = 0.0;
                                worldInstance.sceneryManager.updateMatrix(this.gamePosition.x, this.gamePosition.y, playerPos.z, true);
                                worldInstance.sceneryManager.toggleCollisionPolygonEnabled(playerPos.z,this.fovID, false );


                               
                                this.itemContainer.renderable = false;

                                setTimeout(() => {
                                    explosion.destroy();
                                    this.renderable = false;
                                }, 1500);

                                if (item.stackable){
                                    done();
                                }

                                //warn the guards
                                this.eventsHandler.fire(Danger.EVENTS_HANDLERS.ON_HEAR_EXPLOSION, {
                                    affectedPos: affectedPos,
                                    item: item
                                });

                            }
                        }
                    });

                    EventsHandler.subscribe(Tool.EFFECTS.UNLOCK_BY_CODEBREAKER, ({ affectedPos, item }) => {
                        
                        if (item.name === "codebreaker" && this.locked === true && this.safe === true) {
                            var playerPos = worldInstance.player.gamePosition;
                            var distance = this.getDistance(playerPos.x, playerPos.y, this.gamePosition.x, this.gamePosition.y);

                            if (distance === 1 && this.gamePosition.z === playerPos.z) {
                                this.locked = false;
                                this.padlock.alpha = 0.0;
                                worldInstance.sceneryManager.updateMatrix(this.gamePosition.x, this.gamePosition.y, playerPos.z, true);
                            }
                        }
                    });
                }

            });
        });
    }

    getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    addBaloon(timeout = 2000, doorType) {
        if (this.baloon) {
            ease.removeEase(this.baloon);
            this.baloon.destroy();
            this.baloon = null;
        }
        let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
        let container_baloon = new PIXI.Container();
        let icon_container = new PIXI.Container();
        var icon_item;
        if(doorType === "safe"){
            if ((Math.random() * (100 - 1) + 1) > 50) {
                icon_item = new Sprite(textures["maps/tools/12_dynamite.png"]);
            } else {
                icon_item = new Sprite(textures["maps/tools/13_codeBreaker.png"]);
            }
        }else{
            icon_item = new Sprite(textures["maps/tools/_0003_LockPick.png"]);
        }

        icon_item.anchor.set(0.0)
        icon_item.position.set(-50, -50)
        icon_container.addChild(icon_item)
        icon_container.scale.set(0.5);
        icon_container.position.set(38, -40);

        let sprite = new Sprite(textures['maps/Shared Elements/alertsBallon/ballon_thinking.png']);
        sprite.anchor.set(0, 1);

        container_baloon.position.set(-5, -11);
        container_baloon.addChild(sprite);
        container_baloon.alpha = 0;
        container_baloon.scale.set(0.4);
        container_baloon.addChild(icon_container);

        this.sceneryManager.worldInstance.player.addChild(container_baloon);

        var open = ease.add(container_baloon, { scale: 1, alpha: 1 }, { duration: 1000, ease: "easeOutElastic" });
        open.once("complete", () => {
            var close = ease.add(container_baloon, { scale: 0.5, alpha: 0 }, { duration: 200, wait: timeout });
            close.once("complete", () => {
                this.baloon.destroy();
                this.baloon = null;
            });
        });

        this.baloon = container_baloon;
    }

}