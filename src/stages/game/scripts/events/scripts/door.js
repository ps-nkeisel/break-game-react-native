import BaseScript from './base';
import { ease } from 'pixi-ease';
import Scenery from '../../core/scenery';
import Sound from '../../core/sound';

const PIXI = require("pixi.js");


export default class Door extends BaseScript {

    opened = false;
    constructor(sceneryManagerInstance){
        super(sceneryManagerInstance);

        this.soundDoorClose = new Sound("doorClose",{
            volume: 0.6
        });
        this.soundDoorOpen = new Sound("doorOpen",{
            volume: 1
        });
    }

    onMovementStart({ moveTo }, event_type, entity, context) {
        

        var doors = this.getItemsFromPosition({...moveTo,z: context.gamePosition.z}, { obstacle: "door" }, Scenery.CONTAINER_TYPE.STATIC);
        
        if (doors.length > 0) {
            this.door = doors[0];

            if (this.door.itemContainer.renderable){
                this.openDirection("up");
                this.tryClose();
            }

        }else{
            
            doors = this.getRegisteredItems({ locked: true },  true); 
            if (!context.isPlayer) return true;

            doors.forEach(door => {
                var playerPos = this.sceneryManagerInstance.worldInstance.player.gamePosition;

                if(door.padlock === undefined){
                    return true;
                }

                var distance = this.getDistance(playerPos.x, playerPos.y, door.gamePosition.x, door.gamePosition.y);
                if (distance < 10 && door.gamePosition.z === playerPos.z && door.padlock !== null && door.padlock !== undefined){
                    door.padlock.alpha = 1 - (distance/10);
                }else if(door.padlock !== null && door.padlock !== undefined){
                    door.padlock.alpha = 0.0;
                }

                //remove o sprite do padlock
                if(door.locked === false && door.padlock !== null && door.padlock !== undefined){
                    door.padlock.alpha = 0.0;
                    door.padlock.destroy();
                    door.padlock = undefined;
                }

                // if (distance <= 2 && door.locked === true && (door.baloon === undefined || door.baloon === null)){ //this.baloon
                //     door.addBaloon(2000);
                // } 

                if (distance <= 2 && door.safe === true && door.locked === true && (door.baloon === undefined || door.baloon === null)){ //this.baloon
                    door.addBaloon(2000, "safe");
                }else if(distance <= 2 && door.locked === true && (door.baloon === undefined || door.baloon === null)){
                    door.addBaloon(2000, "locked");
                }
            });
        }

    }

    getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    tryClose() {
        setTimeout(() => {
            var itemPos = this.door.gamePosition;
            var creatures = this.getAllCreatures(itemPos)
            var hasCreature = false;
            if (creatures){
                hasCreature = creatures.length > 0;
            }

            if (!hasCreature)
                this.close();
            else
                this.tryClose();
        }, 500);
    }


    close() {
        console.log("Chegou!")
        this.soundDoorClose.play(true);

        ease.add(this.door.children[0], { rotation: this.door.rotationOriginal, position: {x:0, y:0} }, { duration: 100 });
        this.opened = false;

        let x = this.door.gamePosition.x;
        let y = this.door.gamePosition.y;
        
        this.sceneryManagerInstance.toggleCollisionPolygonEnabled(this.door.gamePosition.z,this.door.fovID, true );


        
    }

    openDirection(direction) {
        const { isHorizontalFliped, isVerticalFliped, isDiagonalFliped } = this.door.fliped;
        this.door.init();

        
        this.opened = true;
        this.direction = direction;

        var properties = {};
        if (!isDiagonalFliped) // Horizontal
            if (isHorizontalFliped) {
                if (direction === "down") {
                    properties = { position: { x: 24, y: 64 }, rotation: PIXI.DEG_TO_RAD * -90 };
                } else if (direction === "up") {
                    properties = { position: { x: 48, y: -30 }, rotation: PIXI.DEG_TO_RAD * 90 };
                }
            } else {
                if (direction === "down") {
                    properties = { position: { x: 10, y: 32 }, rotation: PIXI.DEG_TO_RAD * 90 };
                } else if (direction === "up") {
                    properties = { position: { x: -20, y: 0 }, rotation: PIXI.DEG_TO_RAD * -90 };
                }
            }
        else
            if (isVerticalFliped) {
                properties = { position: { x: -32, y: 54 }, rotation: PIXI.DEG_TO_RAD * -90 };
            } else {
                properties = { position: { x: 0, y: -23 }, rotation: PIXI.DEG_TO_RAD * 90 };
            }



        this.soundDoorOpen.play(true);
        ease.add(this.door.children[0], properties, { duration: 100 });


        this.sceneryManagerInstance.toggleCollisionPolygonEnabled(this.door.gamePosition.z,this.door.fovID,false );
    }

}