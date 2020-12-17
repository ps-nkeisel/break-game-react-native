
import CreatureMovement from './creatureMovement'
import World from './world'


import EventsHandler from '../utils/eventsHandler';

import { ease } from 'pixi-ease'
import _ from 'underscore';
import ObjectItem from './object';
import CreatureRenderer from './creatureRenderer';
import { isPositionEqual } from "../utils/matrix"


const PIXI = require("pixi.js"), { Container, Sprite } = PIXI;

var cont = 0;


const CREATURES = require("../../manifests/creatures.json");

export default class Creature extends ObjectItem {

    constructor(skin, hat, backpack) {
        super();

        this.creatureId = Math.random() * 10000001 | 0;


        this.isPlayer = false;
        this.walkable = false;
        //this.zIndex = zIndex.CREATURE;
        this.typeObject = 'creature';
        this.eventsHandler = new EventsHandler("CREATURE", this);


        this.posX = 0;
        this.posY = 0;
        this.name = "Unnamed Creature";


        this.bodyContainer = new Container();
        this.addChild(this.bodyContainer);


        this.state = {};
        this.speed = 220;
        this.movements = new CreatureMovement(this);

        this.creatureRenderer = new CreatureRenderer(skin, hat, backpack); // true = player        

        this.state.walk = false;
        this.state.walking = false;

        this.baloon = null;

        this.visionBlocks = [];

        this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
            EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, () => {

                this.sceneryManager.ticker.add(() => {
                    if ((this.sceneryManager.visibleZ !== this.gamePosition.z) || this.invisible === true) {
                        this.renderable = false;
                        this.visible = false;
                    }
                    else {
                        this.visible = true;
                        this.renderable = true;
                    }
                });

            });
        });
        //this.sceneryManager

        this.init();
    }

    getDirection() {
        if (!this.lastDirection) return "right";
        return this.lastDirection;
    }

    addBaloon(timeout = 2000, type, icon) {

        if (this.baloon) {
            ease.removeEase(this.baloon);
            this.baloon.destroy();
            this.baloon = null;
        }
        var urlBallon = null;
        var textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
        var container_baloon = new PIXI.Container();
        var icon_container = new PIXI.Container();
        var icon_exclamation = new Sprite(textures["maps/Shared Elements/alertsBallon/exclamation_sign.png"]);
        var icon_forbidden = new Sprite(textures["maps/Shared Elements/alertsBallon/x.png"]);

        switch (type) {
            //if (icon === "detected") {
            case "detected":
                var icon_thief = new Sprite(textures["maps/Shared Elements/alertsBallon/mask_icon.png"]);
                icon_thief.anchor.set(0.5)
                icon_thief.position.set(-5, 15)
                icon_container.addChild(icon_thief)
                icon_exclamation.anchor.set(0.5)
                icon_exclamation.position.set(150, 10)
                icon_container.addChild(icon_exclamation)
                icon_container.scale.set(0.18);
                icon_container.position.set(38, -40);

                urlBallon = 'maps/Shared Elements/alertsBallon/ballon_orange.png';
                break; //}

            //if (icon === "fullbackpack") {
            case "fullbackpack":
                var icon_backpack = new Sprite(textures["maps/Shared Elements/alertsBallon/_0013_Giant-Sack.png"]);
                icon_backpack.anchor.set(0.0)
                icon_backpack.position.set(-95, -110)
                icon_backpack.scale.set(0.5);
                icon_container.addChild(icon_backpack)
                icon_exclamation.anchor.set(0.5)
                icon_exclamation.position.set(140, -14)
                icon_container.addChild(icon_exclamation)
                icon_container.scale.set(0.2);
                icon_container.position.set(38, -40);

                urlBallon = 'maps/Shared Elements/alertsBallon/ballon_thinking.png';
                break; //}

            //if (icon === "investigation"){
            case "investigation":
                var style = new PIXI.TextStyle({
                    fill: 0xFFC853,
                    fontFamily: "MarketDeco",
                    fontSize: 42,
                    letterSpacing: 1,
                });

                var interrogation_container = new PIXI.Container();
                interrogation_container.position.set(0, -50)

                var interrogation_a = new PIXI.Text("?", { ...style, fontSize: 32 });
                interrogation_a.position.set(12, 0)
                interrogation_container.addChild(interrogation_a);

                var interrogation_b = new PIXI.Text("?", { ...style });
                interrogation_b.position.set(27, 0)
                interrogation_container.addChild(interrogation_b);

                var interrogation_c = new PIXI.Text("?", { ...style, fontSize: 32 });
                interrogation_c.position.set(48, 0)
                interrogation_container.addChild(interrogation_c);

                icon_container.addChild(interrogation_container);

                urlBallon = 'maps/Shared Elements/alertsBallon/ballon_thinking.png';
                break;//}

            case "info":
                var icon_backpack = new Sprite(textures["maps/tools/11_fake_id.png"]);
                icon_backpack.anchor.set(0.0)
                icon_backpack.position.set(-95, -110)
                icon_backpack.scale.set(2.5);
                icon_container.addChild(icon_backpack)
                // icon_exclamation.anchor.set(0.5)
                // icon_exclamation.position.set(140, -14)
                // icon_container.addChild(icon_exclamation)
                icon_container.scale.set(0.2);
                icon_container.position.set(38, -40);

                urlBallon = 'maps/Shared Elements/alertsBallon/ballon_white.png';
                break;

            case "forbidden":
                var icon_tool = new Sprite(textures[icon]);
                icon_tool.anchor.set(0.0);
                icon_tool.position.set(-130, -110);
                icon_tool.scale.set(2.5);
                icon_container.addChild(icon_tool);
                icon_forbidden.anchor.set(0.5);
                icon_forbidden.position.set(-10, -5);
                ease.add(icon_forbidden, { alpha: 0 }, { duration: 500, repeat: true });
                icon_container.addChild(icon_forbidden);
                icon_container.scale.set(0.2);
                icon_container.position.set(38, -40);

                urlBallon = 'maps/Shared Elements/alertsBallon/ballon_thinking.png';
                break; //}
        }

        //const urlBallon = icon === 'detected' ? 'maps/Shared Elements/alertsBallon/ballon_orange.png' : 'maps/Shared Elements/alertsBallon/ballon_thinking.png'

        var sprite = new Sprite(textures[urlBallon]);


        container_baloon.position.set(-10, -22);
        container_baloon.addChild(sprite)


        sprite.anchor.set(0, 1);
        //sprite.scale.set(0.2);

        container_baloon.alpha = 0;
        container_baloon.scale.set(0.4);

        container_baloon.addChild(icon_container);

        this.addChild(container_baloon);

        var open = ease.add(container_baloon, { scale: 1, alpha: 1 }, { duration: 1000, ease: "easeOutElastic" });
        open.once("complete", () => {
            ease.add(container_baloon, { scale: 0.5, alpha: 0 }, { duration: 200, wait: timeout });
        });

        this.baloon = container_baloon;
    }

    teleportTo(x, y, z) {
        var current = this.gamePosition;
        this.sceneryManager.updateMatrix(current.x, current.y, current.z, true);
        this.setPosition(x, y, z);
        this.sceneryManager.updateMatrix(x, y, z, false);
    }

    boxesIntersect(a, b) {
        var ab = a.getBounds();
        var bb = b.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    init() {


        this.bodyContainer.addChild(this.creatureRenderer);
        this.renderState(false);
        return true;
    }

    setDirection(direction, seconddirection) {
        if (!this.state.walking)
            this.renderState(false);

        this.state.direction = direction;
        this.state.seconddirection = seconddirection;
    }

    getCreaturePosition() {
        return this.gamePosition;
    }

    setDirection(direction) {
        var degree = 0;
        if (direction === "down")
            degree = PIXI.DEG_TO_RAD * 90
        else if (direction === "left")
            degree = PIXI.DEG_TO_RAD * 180

        this.bodyContainer.rotation = degree;
    }

    getWaypointsTo(fromPosition, toPosition) {
        var currentFloor = fromPosition.z;
        const diffFloor = toPosition.z - currentFloor;
        var newFloor = currentFloor + (diffFloor > 0 ? 1 : -1)
        // He needs a stair
        if (diffFloor !== 0) {
            var stairs = this.sceneryManager.getStairsFromFloor(currentFloor, newFloor);
            if (stairs && stairs[0]) {
                let stair = stairs[0];
                let stairToPosition = { x: stair.properties.toPositionX, y: stair.properties.toPositionY, z: stair.properties.toPositionZ }
                let stairPosition = { x: stair.x, y: stair.y, z: currentFloor, toPosition: stairToPosition };
                var pathTo = this.getWaypointsTo(stairToPosition, toPosition);
                return _.union([stairPosition], pathTo)
            } else {
                throw new Error("Stair not found from Z " + currentFloor + " to Z " + newFloor)
            }
        } else {
            return [toPosition];
        }
    }

    getDistanceFromPos(toPosition) {
        var lastFromPos = this.gamePosition;
        var positions = this.getWaypointsTo(lastFromPos, toPosition);
        var distance = 0;

        positions.forEach(pos => {
            distance = this.sceneryManager.tracePath(lastFromPos, pos).length;
            if (pos.toPosition) // It's an stair
                lastFromPos = pos.toPosition;
            else
                lastFromPos = pos;
        });
        return distance;
    }

    moveToPosition(toPosition, determined = false, callback, normalizePath = false, tryingAgain = false) {
        const EVENTS = CreatureMovement.EVENTS_HANDLERS;
        cont++;
        var that = this;


        try {
            clearTimeout(that.findAnotherPath)
            that.findAnotherPath = null;
        } catch (err) {
            console.error(err);
        }

        if (isPositionEqual(toPosition, this.gamePosition)) {
            callback(EVENTS.ON_PATH_FINISHED);
            return true;
        }



        var paths = this.getWaypointsTo(this.getCreaturePosition(), toPosition);
        var path = this.sceneryManager.tracePath(this.getCreaturePosition(), paths.shift());

        this.hasQueueOfWaypoints = paths.length > 0;




        this.movements.setDirections(path, {
            callback: _callback,
            normalizePath: normalizePath
        });

        function _callback(status, data) {


            if ((status === EVENTS.ON_PATH_BLOCKED || status === EVENTS.ON_PATH_NOWAY) && determined) {
                console.log("Trying to find another path")
                that.findAnotherPath = setTimeout(() => {
                    that.moveToPosition(toPosition, true, callback, normalizePath, true);
                }, 150);
            } else if (status === EVENTS.ON_PATH_FINISHED && paths[0]) {
                that.moveToPosition(toPosition, determined, callback, normalizePath, true);
            }
            else {
                if (typeof callback == "function") {
                    callback(status, data);
                }
            }
        }
    }


    startWalking() {
        this.state.walk = true;
        if (this.state.walking) return true;
        else {
            this.renderState(this.state.direction, true);
        }


        this.state.walking = true;
        let direction = this.state.direction;

        let moviment = this.moveObjectByDirection(direction);
        moviment.once('complete', () => {
            this.state.walking = false;

            if (this.state.walk)
                this.startWalking();
            else
                this.renderState(false);
        });
    }

    stopWalking() {
        this.state.walk = false;
    }




    renderState(walking = false) {
        if (this.walking === walking) return true;
        this.creatureRenderer.setWalkingState(walking);
    }


    // Utils
    static getCreatureById(id) {
        return _.findWhere(CREATURES, { creatureid: id });
    }

    static loadResources() {
        return new Promise((resolve, reject) => {
            CREATURES.forEach(item => {
                var resources = item.resource;
                if (!Array.isArray(item.resource))
                    resources = [item.resource];
                resources.forEach(resource => {
                    PIXI.Loader.shared.add(`images/creatures/${resource}`);
                });
            });
            PIXI.Loader.shared.load(function () {
                resolve();
            });
        });
    }

}