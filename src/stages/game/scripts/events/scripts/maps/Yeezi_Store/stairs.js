import BaseScript from '../../base';






export default class YeeziStoreStairs extends BaseScript {

    onMovementFinished({ moveTo }, event_type, entity, creature) {

        var stairsCurrentFloor = this.sceneryManagerInstance.getStairsFromFloor(creature.gamePosition.z);

        if (!stairsCurrentFloor)
            return false;

        stairsCurrentFloor.forEach(posTrigger => {
            if (posTrigger.x === moveTo.x && posTrigger.y === moveTo.y) {

                var positionX = posTrigger.properties.toPositionX;
                var positionY = posTrigger.properties.toPositionY;
                var positionZ = posTrigger.properties.toPositionZ;
                var setDirection = posTrigger.properties.setDirection;

                creature.movements.clearPaths();
                creature.teleportTo(positionX, positionY, positionZ);

                if (setDirection) {
                    if (setDirection !== "down" && setDirection !== "up" && setDirection !== "left" && setDirection !== "right")
                        throw new Error("setDirection \"" + setDirection + "\" property is invalid for stairs objects.");

                    creature.setDirection(setDirection);
                    if (!creature.hasQueueOfWaypoints) {

                        if (setDirection === "down") {
                            creature.moveToPosition({ x: positionX, y: positionY + 2,z:positionZ });
                        }
                        else if (setDirection === "up") {
                            creature.moveToPosition({ x: positionX, y: positionY - 2,z:positionZ });
                        }
                        else if (setDirection === "left") {
                            creature.moveToPosition({ x: positionX -2, y: positionY,z:positionZ });
                        }
                        else if (setDirection === "right") {
                            creature.moveToPosition({ x: positionX +2, y: positionY,z:positionZ });
                        }
                    }
                }
            }
        });

    }
}


