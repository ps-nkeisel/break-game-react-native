import { transformGamePositionToCoord, getPosByDirection } from '../utils/matrix'
import { ease } from 'pixi-ease';
import EventsHandler from '../../scripts/utils/eventsHandler';
import World from './world';
import Player from './player';
const PIXI = require("pixi.js");

export default class CreatureMovement {

    static EVENTS_HANDLERS = {
        ON_PATH_SET: "ON_PATH_SET",
        ON_PATH_CHANGED: "ON_PATH_CHANGED",
        ON_PATH_CANCELED: "ON_PATH_CANCELED",
        ON_PATH_NOWAY: "ON_PATH_NOWAY",
        ON_PATH_BLOCKED: "ON_PATH_BLOCKED",
        ON_PATH_FINISHED: "ON_PATH_FINISHED",
        ON_MOVEMENT_START: "ON_MOVEMENT_START",
        ON_MOVEMENT_FINISHED: "ON_MOVEMENT_FINISHED"
    };

    constructor(creature) {

        /**
         * @type {Creature}
         */
        this.creature = creature;
        this.eventsHandler = this.creature.eventsHandler;

        this.paths = [];
        this.paths_torepeat = null;
        this.options = { repeat: false, callback: null };
        this.running = false;

        EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_UNLOADED,()=>{
            this.cancel();
        });
    }

    setAngleDeg(angle){
        return this.creature.bodyContainer.rotation = angle * PIXI.DEG_TO_RAD;
    }

    setDirections(paths, options = {}) {
       
        
        if (paths.length === 0){
            this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_NOWAY);
            return true;
        }
        
        if (options.normalizePath)
            paths = this.normalizePath(paths);
        
        
        if (this.options.callback && this.paths.length > 0) {
            this.cancel();
        }
        this.options = options;
        this.paths = paths;

        if (this.paths.length === 0){
            this.options = options;
            this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_FINISHED);
            return true;
        }


        this.paths_torepeat = options.repeat === true ? [...paths] : null;
        this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_SET, [...paths]);

        this.run();
    }

    clearPaths(){
        this.paths = [];
    }

    cancel() {
        this.paths = [];
        this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_CANCELED);
        this.options = {};
    }

    sendEvent(eventType, data) {
        this.eventsHandler.fire(eventType, data);
        if (typeof this.options.callback == "function") {
            this.options.callback(eventType, data)
        }
    }

    run() {
        if (this.running === true) return true;

        
        if (this.paths.length > 0) {
            this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_CHANGED, [...this.paths]);
            
            let direction = this.paths.shift();

            let moviment = this.moveObjectByDirection(direction[0], direction[1]);
            if (!moviment) {
                
                this.creature.renderState(false);
                this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_BLOCKED)
                return this.cancel();
            }


            this.running = true;

            this.creature.renderState(true);
            moviment.once('complete', () => {
                this.running = false;
                this.run();
            });
        } else {
            if (this.options.repeat === true) {
                this.paths = [...this.paths_torepeat];
                this.run();
            } else {
                this.creature.renderState(false);
                this.sendEvent(CreatureMovement.EVENTS_HANDLERS.ON_PATH_FINISHED);
            }
        }

    }

    normalizePath(directionsPath){
        var lastPos = this.creature.gamePosition;

        var paths = [];
        directionsPath.forEach(_direction => {
            let direction = _direction[0]
            let secondDirection = _direction[1];
            var moveTo = getPosByDirection(lastPos, direction, secondDirection);
            moveTo = {...moveTo,z:lastPos.z};
            if (this.creature.sceneryManager.isPositionWalkable(moveTo.x, moveTo.y,moveTo.z)){
                paths.push(_direction);
            }
            lastPos = moveTo;
        });
        return paths;
    }

    moveObjectByDirection(direction, secondDirection) {
        var moveTo = getPosByDirection(this.creature.gamePosition, direction, secondDirection);
        
        moveTo = {...moveTo, z: this.creature.gamePosition.z}
        
        var coordinates = transformGamePositionToCoord(moveTo.x, moveTo.y);       

        let current_rotation = this.creature.bodyContainer.rotation / Math.PI;
        
        if (!this.creature.sceneryManager.isPositionWalkable(moveTo.x, moveTo.y,this.creature.gamePosition.z)) return false;
        
        var directions = {
            right: 0,
            down: 0.5,
            left: 1,
            up: 1.5
        }
        
        var toPosAttributes = { x: coordinates.x, y: coordinates.y };
        var toRotationAttributes = {};
        let direction_to;

        
//let direction_
        let direction_ = directions[direction];

        var degrees = shortestDistDegrees(current_rotation * 180, direction_ * 180) / 180 / 180

        // if ( this.creature instanceof Player){
        //     debugger
        //     console.log("degrees",degrees, this.setAngleDirection(direction_ * PIXI.RAD_TO_DEG))
        // }

        if (secondDirection) {
            let secondDirection_ = directions[secondDirection];
            if (direction_ === directions.right && secondDirection_ === directions.up) {
                direction_ = 2
            }
            degrees = shortestDistDegrees(current_rotation * 180, ((direction_ + secondDirection_) / 2) * 180)  / 180 / 180;
        }



        if (direction_ !== current_rotation || this.creature.bodyContainer.lastDegree !== degrees) {
            direction_to = current_rotation + degrees;
            toRotationAttributes['rotation'] = direction_to * Math.PI;
            this.creature.bodyContainer.lastDegree = degrees;
            this.creature.bodyContainer.lastAngle = degrees * PIXI.RAD_TO_DEG;
        }

        let speed = this.creature.speed
        if (secondDirection) {
            speed *= Math.hypot(32, 32) / 32;
        }

        this.creature.lastDirection = direction + (secondDirection ? "-" + secondDirection : "");
        //
        
        this.eventsHandler.fire(CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_START, { moveTo: moveTo });



        this.movimentRotation = ease.add(this.creature.bodyContainer, toRotationAttributes, { duration: speed, ease: 'linear' });
        this.moviment = ease.add(this.creature, toPosAttributes, { duration: speed, ease: 'linear' });

        let fromPos = this.creature.gamePosition;


        this.creature.gamePosition = moveTo;


        this.movimentRotation.once('complete', () => {
            if (direction_to === 2) {
                this.creature.bodyContainer.rotation = directions.right * Math.PI;
            }
        });

        this.moviment.once('complete', () => {
            this.eventsHandler.fire(CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_FINISHED, { fromPos: fromPos, moveTo: moveTo });
        });
        return this.moviment;
    }

    setAngleDirection(angleDegree, animation=true, speed){
        // if (this.creature instanceof Player)
        //     debugger;
        
        var directions = {
            right: 0,
            down: 0.5,
            left: 1,
            up: 1.5
        }
       
        let current_rotation = this.creature.bodyContainer.rotation / Math.PI;
        let direction_ = (angleDegree * PIXI.DEG_TO_RAD) / Math.PI;
        let degrees = shortestDistDegrees(current_rotation * 180, direction_ * 180) / 180 / 180;
        
        let direction_to = current_rotation + degrees;
        
        if (this.creature.bodyContainer.lastDegree === degrees || this.creature.bodyContainer.lastAngle === angleDegree) return true;


        this.creature.bodyContainer.lastDegree = degrees;
        this.creature.bodyContainer.lastAngle = angleDegree;
        
        if (speed === undefined){
            speed = this.creature.speed;
        }
        if (animation === true){

            let movimentRotation = ease.add(this.creature.bodyContainer, {rotation: direction_to * Math.PI}, { duration: speed, ease: 'linear' });
            movimentRotation.once('complete', () => {
                if (direction_to === 2) {
                    this.creature.bodyContainer.rotation = directions.right * Math.PI;
                }
            });
        }else{
            this.creature.bodyContainer.rotation = direction_to * Math.PI;
        }

        return true;
    }
}

function shortestDistDegrees(start, stop) {
    const modDiff = (stop - start) % 360;
    let shortestDistance = 180 - Math.abs(Math.abs(modDiff) - 180);
    return (modDiff + 360) % 360 < 180 ? shortestDistance *= 180 : shortestDistance *= -180;
}