
import ObjectItem from './object';
import World from './world';
import EventsHandler from '@/stages/game/scripts/utils/eventsHandler';
import Creature from './creature';
import CreatureMovement from './creatureMovement'
import { transformGamePositionToCoord } from '../utils/matrix'
import _ from 'underscore'
import Sounds from '@/stages/game/scripts/core/sound';
import Tool from './tool';
import { ease } from 'pixi-ease';
import IsEqual from "is-equal"

const PIXI = require("pixi.js"),
    { Container, Sprite } = PIXI;

export default class Danger extends Creature {


    static EVENTS_HANDLERS = {
        ON_DANGER_START_CHASING: "ON_DANGER_START_CHASING",
        ON_DANGER_STOP_CHASING: "ON_DANGER_STOP_CHASING",
        ON_HEAR_EXPLOSION: "ON_HEAR_EXPLOSION",
        ON_EXPLOSION_END: "ON_EXPLOSION_END"
    };

    static MODE = {
        "PATROLLING": 0,
        "CHASING": 1,
        "INVESTIGATING": 2
    }

    setMode(mode, showBalomn = true) {
        if (mode === Danger.MODE.INVESTIGATING) {
            this.destroyItemTrown();
            try {
                if (this.type !== "observer" && this.type !== "worker" && this.type !== "neutral") {
                    let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
                    let target_position = textures["maps/Shared Elements/target_position.png"];
                    if (this.target) {
                        this.target.destroy();
                        this.target = null;
                    }
                    this.target = new PIXI.Sprite(target_position);
                    this.target.anchor.set(0.5)
                    //this.target.scale.set(0.2)
                    let pos = transformGamePositionToCoord(this.positionToInvestigate.x, this.positionToInvestigate.y);
                    this.target.position.set(pos.x, pos.y);
                    this.sceneryManager.upperSceneryContainer.addChild(this.target);



                    if (this.investigating) {
                        clearTimeout(this.investigating);
                        this.investigating = undefined;
                    }

                    this.moveToPosition(this.positionToInvestigate, true, (status, data) => {
                        if (status === CreatureMovement.EVENTS_HANDLERS.ON_PATH_FINISHED) {
                            this.investigating = setTimeout(() => {
                                this.setMode(Danger.MODE.PATROLLING)
                            }, 5000);
                        }
                    }, true);
                }
            } catch (err) {
                console.error(err)
            }
        } else {
            if (this.target) {
                this.target.destroy();
                this.target = null;

                console.log("EGG: parou investigação");
                this.eventsHandler.fire(Danger.EVENTS_HANDLERS.ON_DANGER_STOP_CHASING, { danger: this });
                if (this.heardExplosion === true) {
                    this.eventsHandler.fire(Danger.EVENTS_HANDLERS.ON_EXPLOSION_END, { danger: this });
                }
                this.destroyItemTrown();
            }
        }

        if (mode !== this.mode) {
            if (mode === Danger.MODE.PATROLLING){
                this.movingToWaypoint = false;
            }

            this.lastModeUpdated = new Date().getTime();

            if (mode === Danger.MODE.CHASING) {
                if (this.type === "worker" || this.type === "neutral") {
                    this.movements.cancel();
                }

                this.eventsHandler.fire(Danger.EVENTS_HANDLERS.ON_DANGER_START_CHASING, { danger: this });
                if (showBalomn)
                    this.addBaloon(2000, "detected");
            }

            if (mode === Danger.MODE.INVESTIGATING && this.type !== "worker" && this.type !== "neutral") {
                var huhSounds = [
                    new Sounds("huh1"),
                    new Sounds("huh2")
                ];
                _.sample(huhSounds).play();

                if (showBalomn)
                    this.addBaloon(4000, "investigation");
            }

        }
        this.mode = mode;
        // if (this.type === "neutral"){
        //     this.setMode(Danger.MODE.PATROLLING);
        // }
    }

    constructor(skin, dangerName, waypoints, speed, minAngle = 0, maxAngle = 0, revert, type) {
        super(skin);

        this.dangerName = dangerName;
        this.waypoints = waypoints;


        this.mode = Danger.MODE.PATROLLING;

        

        this.coneAlpha = 0.35;

        this.speed = speed;

        this.originalSpeed = speed;

        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
        this.revert = revert;
        this.type = type;

        if (waypoints.length === 1){
            const { angle } = waypoints[0].properties;
            if (angle !== undefined){
                this.movements.setAngleDirection(angle, false);
            }
        }

        this.movingToWaypoint = false;

        if (this.type == "observer") {
            if (this.revert) {
                this.bodyContainer.rotation += PIXI.DEG_TO_RAD * maxAngle;
                this.lookingTo = "left";

            } else {
                this.bodyContainer.rotation += PIXI.DEG_TO_RAD * minAngle;
                this.lookingTo = "right";
            }
        }
        
        
        this.followingWaypointsIndex = 0
        this.heySounds = [
            new Sounds("hey01"),
            new Sounds("hey02"),
            new Sounds("hey03"),
        ];
        this.isLoaded = true;
        EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, () => {
            this.isLoaded = true;
        });

        EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_UNLOADED, () => {
            this.isLoaded = false;
        });


        EventsHandler.subscribe(Tool.EFFECTS.THROWABLE_COLLISION, ({ affectedPos, item, sprite, destroy }, event, teste2, context) => {
            if (this.itemThrown === null) {
                this.itemThrown = item;
                this.itemThrown.onFloor = true;
                this.itemThrown.caughtAttention = false;
                this.itemThrown.fading = false;
                this.itemThrown.sprite = sprite; //.fadeOut();
            }

            if (this.mode !== Danger.MODE.CHASING && this.type !== "neutral") {
                let distance = this.getDistanceFromPos(affectedPos)

                if (distance <= 15) {
                    this.positionToInvestigate = affectedPos;
                    this.setMode(Danger.MODE.INVESTIGATING);
                    this.onSetModeHandler = destroy;
                } else {
                    console.log("EGG: não chamou atenção, some em segundos");
                    this.destroyItemTrown();
                }
            }
        });

        if (this.type !== "observer" && this.type !== "worker" && this.type !== "neutral") {
            EventsHandler.subscribe(Danger.EVENTS_HANDLERS.ON_HEAR_EXPLOSION, ({ affectedPos, item }) => {
                if (this.mode !== Danger.MODE.INVESTIGATING) {
                    this.positionToInvestigate = affectedPos;
                    this.heardExplosion = true;
                    this.setMode(Danger.MODE.INVESTIGATING);
                }
            });

            EventsHandler.subscribe(Danger.EVENTS_HANDLERS.ON_EXPLOSION_END, ({ danger }) => {
                if (this.mode !== Danger.MODE.PATROLLING) {
                    this.heardExplosion = false;
                    this.setMode(Danger.MODE.PATROLLING);
                }
            });
        }

        EventsHandler.subscribe(Danger.EVENTS_HANDLERS.ON_DANGER_START_CHASING, ({ danger }) => {
            if (danger !== this) {
                this.mode = Danger.MODE.CHASING;
                this.addBaloon(2000, "detected");
                this.lastModeUpdated = new Date().getTime();
            }
        });

        EventsHandler.subscribe(Danger.EVENTS_HANDLERS.ON_DANGER_STOP_CHASING, () => {
            this.setMode(Danger.MODE.PATROLLING);
        });

        this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
            EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, () => {
                this.sceneryManager.ticker.add(() => {
                    this.play();
                });
            });
        });

        if (this.type === "observer") {
            this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
                EventsHandler.subscribe(Tool.EFFECTS.BLOCK_SIGNAL, () => {
                    //console.log("SINAL BLOQUEADO");
                    if (this.active) {

                        ease.add(this, { coneAlpha: 0 }, { duration: 200, repeat: true });
                        setTimeout(() => {
                            ease.removeEase(this);
                            this.active = false;
                            this.coneAlpha = 0;
                            //voltando em 5 segundos
                            setTimeout(() => {
                                this.coneAlpha = 0.35;
                                this.active = true;
                            }, 5000);

                        }, 700);
                    }
                });
            });
        }

        if (this.type === undefined || this.type === "worker") {
            this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
                EventsHandler.subscribe(Tool.EFFECTS.USE_FAKE_ID, () => {
                    console.log("USANDO FAKEID");
                    if (this.active) {
                        //add fakeID to the body
                        var player = this.sceneryManager.worldInstance.player;
                        let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
                        let fakeIdItem = new Sprite(textures["maps/Characters/MainCharacter/TOOLS/fake_id.png"]);
                        fakeIdItem.anchor.set(0.5);
                        fakeIdItem.rotation = PIXI.DEG_TO_RAD * 90;
                        player.bodyContainer.addChild(fakeIdItem);
                        this.playerHasFakeId = true;

                        player.addBaloon(2000, "info");

                        ease.add(this, { coneAlpha: 0 }, { duration: 200 });
                        setTimeout(() => {
                            //voltando em 5 segundos
                            setTimeout(() => {
                                ease.add(this, { coneAlpha: 0.35 }, { duration: 200 });
                                //remove fakeID from the body
                                player.bodyContainer.removeChild(fakeIdItem);
                                this.playerHasFakeId = false;
                            }, 5000);

                        }, 700);
                    }
                });
            });
        }

        // if (this.type !== "neutral")
        // this.cone = this.renderVisionCone();

        //console.log(this.visionBlocks.length);

        this.lastModeUpdated = null;
        this.positionToInvestigate = null;

        //teste
        this.playerHasFakeId = null; //starts as null, but for performance checks only once per level and changes to true or false
        this.itemThrown = null;
        this.active = true;
        this.heardExplosion = false;
        this.canMove = true;
    }

    updateCameraRotation() {
        if (this.type === "observer") {
            if (this.lookingTo === "right" && this.bodyContainer.rotation * PIXI.RAD_TO_DEG <= this.maxAngle) {
                this.bodyContainer.rotation += PIXI.DEG_TO_RAD * (this.speed / 32);
            } else {
                this.lookingTo = "left";
            }

            if (this.lookingTo === "left" && this.bodyContainer.rotation * PIXI.RAD_TO_DEG >= this.minAngle) {
                this.bodyContainer.rotation -= PIXI.DEG_TO_RAD * (this.speed / 32);
            } else {
                this.lookingTo = "right";
            }
        }
    }

    checkWaypoint() {
        if (this.type === "observer" || !this.isLoaded || this.mode !== Danger.MODE.PATROLLING){
            return true;
        } 
        
        let waypoint = this.waypoints[this.followingWaypointsIndex];
        const { stopFor, angle } = waypoint?.properties;


        if (this.movingToWaypoint === false) {
            this.movingToWaypoint = true;

            this.moveToPosition(waypoint, true, (status, data) => {
                if (status === CreatureMovement.EVENTS_HANDLERS.ON_PATH_FINISHED) {
                    // console.log("movingToWaypoint - false")
                    this.movingToWaypoint = false;
                    
                    if (angle !== undefined) {
                        this.movements.setAngleDirection(angle);
                    }else{
                        this.movements.setAngleDirection(0);
                    }
                    this.followingWaypointsIndex = this.followingWaypointsIndex === this.waypoints.length - 1 ? 0 : this.followingWaypointsIndex + 1;
                } else if (status === CreatureMovement.EVENTS_HANDLERS.ON_PATH_CANCELED) {
                    // console.log("movingToWaypoint - false")
                    this.movingToWaypoint = false;
                }
            });
        }
    }

    canChase() {
        return this.type !== "neutral" && !this.checkPlayerHasFakeId();
    }

    idleHuman(){
        if (this.type !== "observer" && this.mode == Danger.MODE.PATROLLING && this.movingToWaypoint === false){
            this.deltaIdleRotation = this.deltaIdleRotation === undefined ? 0 : this.deltaIdleRotation+ 0.05;
            let add = (Math.sin(this.deltaIdleRotation) - (Math.cos(this.deltaIdleRotation)/2 ) ) * 0.006;
            this.bodyContainer.rotation += add * 0.1;
        }
    }
    
    play() {
        this.updateCameraRotation();
        this.checkWaypoint();
        this.idleHuman();

        if (this.canChase()) {
            this.chasingMode();
        } else if (this.type === "neutral") {
            this.setMode(Danger.MODE.PATROLLING);
        }
    }

    checkPlayerHasFakeId() {
        /*let inventory = GameService.getUserInventory();
        for (let i = 0; i < inventory.length; i++) {
            if (GameService.getItem(inventory[i].id).name === "fakeid") {
                this.playerHasFakeId = true;
                break;
            } else {
                this.playerHasFakeId = false;
            }
        }*/

        return this.playerHasFakeId;
    }

    destroyItemTrown() {
        if (typeof this.onSetModeHandler === "function") {
            this.onSetModeHandler();
            this.onSetModeHandler = undefined;
        }

        // if(this.itemThrown && !this.itemThrown.fading){
        // this.itemThrown.fading = true;
        // this.itemThrown.sprite.fadeOut(() => {
        //     //console.log("CALLBACK!!!!!");
        //     //this.itemThrown.sprite.destroy();
        //     this.itemThrown = null;
        // });
        // }
    }



    detectPlayer() {
        if (!this.canChase()) return true;


        if (this.active === false && this.type === "observer") return;
        var player = this.sceneryManager.worldInstance.player;
        if (player && player.gamePosition.z == this.gamePosition.z && player.renderable && player.visible) {

            //this.collidesWithVisionBlocks(player.bodyContainer, this.sceneryManager);
            //this.collidesWithVisionBlocks(this.bodyContainer, player.bodyContainer);


            if (this.playerInSight && this.mode !== Danger.MODE.CHASING) {
                _.sample(this.heySounds).play();
                player.dangerDetected = true;
                console.log(this.mode,this.movingToWaypoint, this);
                this.setMode(Danger.MODE.CHASING);
            }

            if (this.mode === Danger.MODE.CHASING && this.type != "observer" && this.type != "worker") {
                this.destroyItemTrown();
                let playerPos = player.position;
                let dangerPos = this.position;
                let distance = this.getDistance(playerPos.x, playerPos.y, dangerPos.x, dangerPos.y);

                //When colliding with the player, catches him/her
                // console.log(distance)
                if (distance < 46) { //&& this.scenery.playerReady
                    this.sceneryManager.worldInstance.eventsHandler.fire(World.EVENTS_HANDLERS.ON_PLAYER_GET_CAUGHT);
                    //change the player's body to caught
                    let textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
                    let caughtBody = new Sprite(textures["maps/Characters/MainCharacter/caught.png"]);
                    caughtBody.anchor.set(0.5);
                    caughtBody.rotation = PIXI.DEG_TO_RAD * 90;
                    player.bodyContainer.removeChildren();
                    player.bodyContainer.addChild(caughtBody);
                }

            }

        }
    }

    getUpdatedModeTimeElapsed() {
        if (this.lastModeUpdated === null) return null;

        return (new Date().getTime() - this.lastModeUpdated) / 1000;
    }

    chasingMode() {
        var player = this.sceneryManager.worldInstance.player;

        var playerPos = player.gamePosition;

        if (this.mode === Danger.MODE.CHASING) {
            this.coneTint = 0xFF0000;
            //persegue o player
            if (this.type !== "observer" && this.type !== "worker" && player.renderable && player.visible) {
                if (!IsEqual(this.positionToInvestigate, playerPos)) {
                    this.moveToPosition(playerPos);
                    this.speed = this.originalSpeed * 0.9;
                    this.positionToInvestigate = playerPos;
                }
            }
        } else {
            this.speed = this.originalSpeed;
            this.coneTint = 0xFFFFFF;
        }

        if (this.mode === Danger.MODE.CHASING && this.getDistance(playerPos.x, playerPos.y, this.gamePosition.x, this.gamePosition.y) > 6) {
            if (this.getUpdatedModeTimeElapsed() >= 15) {
                this.positionToInvestigate = playerPos;
                this.setMode(Danger.MODE.INVESTIGATING)
            }
        }
        else if ((this.type === "worker" || this.type === "neutral") && this.getUpdatedModeTimeElapsed() >= 15) {
            this.setMode(Danger.MODE.PATROLLING);
        }

        // if (this.mode === Danger.MODE.INVESTIGATING) {
        //     if (this.getUpdatedModeTimeElapsed() > 10) {
        //         this.setMode(Danger.MODE.PATROLLING)
        //     }
        // }

        if (this.playerInSight) {
            if (!this.mode === Danger.MODE.CHASING) {
                this.setMode(Danger.MODE.CHASING);
            }
        }
    }

    getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

}