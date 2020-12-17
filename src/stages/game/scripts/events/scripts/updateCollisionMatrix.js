import BaseScript from './base';

export default class UpdateCollisionMatrix extends BaseScript {

    onMovementStart({ moveTo }, event_type, entity, creature) {
        let playerPos = creature.gamePosition;
        this.sceneryManagerInstance.updateMatrix(playerPos.x,playerPos.y,playerPos.z, true);
        this.sceneryManagerInstance.updateMatrix(moveTo.x,moveTo.y,playerPos.z, false);
    }
    
    onMovementFinished ({fromPos, moveTo }, event_type, entity, creature) {        
        let creaturePos = creature.gamePosition;
        this.sceneryManagerInstance.updateMatrix(fromPos.x,fromPos.y,creaturePos.z, true);
    }

}