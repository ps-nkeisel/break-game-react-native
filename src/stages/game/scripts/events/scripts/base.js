
import Danger from '../../core/danger';
import { transformGamePositionToCoord } from '../../utils/matrix'
import _ from 'underscore'
export default class BaseScript {

    /**
     * 
     * @param {Scenery} sceneryInstance 
     */
    constructor(sceneryManagerInstance) {
        this.sceneryManagerInstance = sceneryManagerInstance;
        this.playerInstance = sceneryManagerInstance.worldInstance.player;
    }

    getPlayer() {
        return this.playerInstance;
    }

    getPlayerPosition() {
        return this.playerInstance.gamePosition;
    }
    getPlayerWorldPosition(){
        var playerPos = this.getPlayerPosition();
        return transformGamePositionToCoord(playerPos.x,playerPos.y);
    }

    getRegisteredItems(attributes, onlyCurrentFloor=true) {
        return this.sceneryManagerInstance.getAllItemsByAttributes(attributes, onlyCurrentFloor);
    }

    getNearestDanger() {

        let dangers = this.getRegisteredItems().filter((item) => (
            item instanceof Danger
        ));
        if (dangers.length > 0) {
            var nearestDistance = null
            var nearestDanger = null;
            dangers.forEach(danger => {
                let dangerPos = danger.gamePosition;
                let playerPos = this.sceneryManagerInstance.player.gamePosition;
                let distance = getDistance(dangerPos.x, dangerPos.y, playerPos.x, playerPos.y)
                if (nearestDistance == null || distance <= nearestDistance) {
                    nearestDistance = distance;
                    nearestDanger = danger;
                }
            });
            return nearestDanger
        }

        function getDistance(xA, yA, xB, yB) {
            var xDiff = xA - xB;
            var yDiff = yA - yB;
            return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        }
        
        return null

        
    }

    getAllCreatures(pos){
        var items =  this.sceneryManagerInstance.worldInstance.getAllCreatures();
        if (pos) {
            items = items.filter((item) => {
                return item.gamePosition.x === pos.x && item.gamePosition.y === pos.y && (!pos.z || item.gamePosition.z === pos.z);
            });
        }
        return items
    }

    getItemsFromPosition(pos, attributes, type,onlyCurrentFloor=true) {

        var items = _.filter(this.sceneryManagerInstance.getAllItems(type, onlyCurrentFloor), (item) => {
            return item.gamePosition ? (item.gamePosition.x === pos.x && item.gamePosition.y === pos.y  && item.gamePosition.z === pos.z  ) : false;
        });

        if (attributes) {

            items = items.filter((item) => {
                return item.extraData ? _.isMatch(item.extraData.properties, attributes) : false;
            });
        }
        return items;
    }
}