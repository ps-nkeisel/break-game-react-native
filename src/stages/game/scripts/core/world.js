
import { Viewport } from 'pixi-viewport';
import { ease } from 'pixi-ease';
import EventsHandler from '../../scripts/utils/eventsHandler';
import _ from 'underscore'
import gameService from './services/GameService';
import { Dispatchers as DispatchersGame } from '@/store/ducks/gameplay';
import { Dispatchers as DispatchersUser } from '@/store/ducks/user';
import SceneryManager from './sceneryManager'
import Player from './player'
import Danger from './danger'
import EscapeCar from './escapeCar';
import ToolFactory from './toolFactory';
import Store from '@/store';
import Sounds from '@/stages/game/scripts/core/sound';
import Modal from '@/stages/game/scripts/core/modal';
import { Scrollbox } from 'pixi-scrollbox'

import memoize from "memoizee";

const PIXI = require("pixi.js"),
    { Container } = PIXI;

class World extends Container {

    static EVENTS_HANDLERS = {
        ON_SCENERY_LOADED: "ON_SCENERY_LOADED",
        ON_SCENERY_UNLOADED: "ON_SCENERY_UNLOADED",
        ON_PLAYER_GET_CAUGHT: "ON_PLAYER_GET_CAUGHT",
        ON_PLAYER_COMPLETE_LEVEL: "ON_PLAYER_COMPLETE_LEVEL",
        ON_MAP_POINTER_UP: "ON_MAP_POINTER_UP",
        ON_MAP_POINTER_MOVE: "ON_MAP_POINTER_MOVE",
        ON_MAP_POINTER_DOWN: "ON_MAP_POINTER_DOWN",
    }


    constructor(props) {

        super();
        this.inGaming = false;
        this.viewport = null;
        this.sceneryManager = null;
        this.mapName = null;
        this.eventsHandler = new EventsHandler("WORLD", this);

        this.player = null;

        this.sceneryContainer = new Container();
        this.playerContainer = new Container();
        this.dangersContainer = new Container();
        this.toolsContainer = new Container();
        this.upperWorldContainer = new Container();

        this.viewport = new Viewport();
        this.viewport.renderable = false;

        this.addChild(this.viewport);
        this.addChild(this.toolsContainer);
        this.addChild(this.upperWorldContainer);

        this.viewport.addChild(this.sceneryContainer)
        this.viewport.addChild(this.playerContainer)
        this.viewport.addChild(this.dangersContainer)


        




    }

    stopAllAnimations() {
        if (this.player)
            this.player.movements.cancel();
        ease.removeAll();
        if (this.sceneryManager) {
            this.sceneryManager.ticker.stop();
            this.sceneryManager.tickerFOV.stop();

        }
    }

    destroy() {
        if (this.events) {
            this.events.unregister();
        }
        if (this.sceneryManager) {
            this.eventsHandler.fire(World.EVENTS_HANDLERS.ON_SCENERY_UNLOADED);
            this.sceneryManager.ticker.destroy();
            this.sceneryManager.tickerFOV.destroy();
            this.sceneryManager.destroy();
            this.sceneryManager = null;
            EventsHandler.unsubscribeAll();
            this.eventsHandler.unsubscribeAll()
        }
        this.getDangerByID.clear();
        ease.removeAll();
        this.sceneryContainer.removeChildren();
        this.playerContainer.removeChildren();
        this.dangersContainer.removeChildren();
        this.toolsContainer.removeChildren();
        this.upperWorldContainer.removeChildren();
        this.viewport.removeAllListeners();
        this.inGaming = false;
    }

    onInit(baseMap) {

        EventsHandler.subscribe([World.EVENTS_HANDLERS.ON_PLAYER_COMPLETE_LEVEL, World.EVENTS_HANDLERS.ON_PLAYER_GET_CAUGHT], (type) => {
            var { inventory } = Store.getState().gameplay;
            window.bgSound.stop();
            inventory = inventory.filter(item => {
                var info = gameService.getItem(item.id)
                return info.oneRound !== true
            });
            DispatchersUser.setUserInventory(inventory);
            if (this.sceneryManager) {
                this.stopAllAnimations();
            }
        });

        EventsHandler.subscribe([World.EVENTS_HANDLERS.ON_PLAYER_GET_CAUGHT], (type) => {
            let failure = new Sounds("failure");
            failure.play();
        });


        this.destroy();
        this.inGaming = true;
        this.initScene(baseMap);
    }

    initPlayer(pos) {
        var backpack = gameService.getCurrentPlayerBackpack();
        DispatchersGame.setBackpackCapacity(backpack.capacity);

        this.player = new Player();
        this.player.visible = false;
        this.player.renderable = false;
        this.player.invisible = true;
        this.player.setPosition(pos.x, pos.y - 1, pos.z);
        this.playerContainer.addChild(this.player);
        this.sceneryManager.registerSceneryManager(this.player);

    }

    initScene(idMap) {

        this.sceneryManager = new SceneryManager(idMap, this);
        DispatchersGame.initScenary(this.sceneryManager.sceneryManifests);
        
        
        this.initPlayer(this.sceneryManager.sceneryManifests.initPosition);


        this.sceneryManager.init().then(() => { 
            this.sceneryContainer.addChild(this.sceneryManager);
            this.initEvents(this.sceneryManager);
            this.initViewport();
            this.initObstacles();

            this.viewport.renderable = true;

            this.eventsHandler.fire(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, { worldInstance: this });
        });
    }



    initTools() {

        this.sceneryManager.ticker.add(() => {
            if (this.ToolBeltMovingRight) {
                if(this.ToolScrollbox.scrollLeft >= window.innerWidth/2) return;
                this.ToolScrollbox.scrollLeft += 2;
            }
            if (this.ToolBeltMovingLeft) {
                if(this.ToolScrollbox.scrollLeft <= 0) return;
                this.ToolScrollbox.scrollLeft -= 2;
            }
        });

        this.refreshTools();
    }




    refreshTools(resetInventory = true) {
        if (this.inGaming) {


            if (resetInventory) {
                var { inventory } = Store.getState().user;
                DispatchersGame.setInventory(inventory);
            }

            var { inventory } = Store.getState().gameplay;
            inventory = inventory.filter((item) => (
                item.quantity > 0
            ));
            
            this.player.initBonus();

            var backpack = gameService.getCurrentPlayerBackpack();
            DispatchersGame.setBackpackCapacity(backpack.capacity);


            this.ToolScrollbox = new Scrollbox({ 
                stopPropagation: true, 
                boxWidth: window.innerWidth - (inventory.length > 4 ? 100 : 0), 
                scrollbarSize: 0, 
                boxHeight: 80,
                passiveWheel:  false,
                clampWheel: false,
                dragScroll: false
            });

            this.toolsContainer.removeChildren();

            var textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;

            

            inventory.forEach((tool, i) => {
                var _ToolFactory = new ToolFactory(this.sceneryManager);
                var tool = _ToolFactory.makeTool(tool.id, tool.quantity);
                var item = tool.getHotbarContainer();
                if (i > 0) {
                    item.position.set(75 * i, 0);
                }
                this.ToolScrollbox.content.addChild(item);
            });
            this.ToolScrollbox.update();

            this.ToolScrollbox.position.set(window.innerWidth / 2, 0);
            this.ToolScrollbox.pivot.set(this.ToolScrollbox.width / 2, 0);



            this.toolsContainer.addChild(this.ToolScrollbox);

            var timePointerDown = null;

            if (inventory.length > 4) {
                let arrowTextures = {
                    normal: textures["maps/Shared Elements/arrowLeftGear_Normal.png"],
                    pressed: textures["maps/Shared Elements/arrowLeftGear_Pressed.png"]
                }
                var leftButton = new PIXI.Sprite(arrowTextures.normal)
                leftButton.scale.set(0.5)
                leftButton.interactive = true;
                leftButton.addListener("pointertap", () => {
                    if(this.ToolScrollbox.scrollLeft <= 0) return;

                    console.log(getTimeElapsed(timePointerDown) < 0.15)
                    if (getTimeElapsed(timePointerDown) < 0.15){

                        ease.add(this.ToolScrollbox.content, { scrollLeft: 0 }, { duration: 500, ease: "linear" })
                    }
                });
                leftButton.addListener("pointerdown", () => {
                    if(this.ToolScrollbox.scrollLeft <= 0) return;
                    leftButton.texture = arrowTextures.pressed;
                    timePointerDown = new Date().getTime();
                    ease.removeEase(this.ToolScrollbox.content)
                    this.ToolBeltMovingLeft = true;
                });
                leftButton.addListener("pointerup", () => {
                    this.ToolBeltMovingLeft = false;
                    leftButton.texture = arrowTextures.normal;
                });
                leftButton.addListener("pointerupoutside", () => {
                    leftButton.texture = arrowTextures.normal;
                    this.ToolBeltMovingLeft = false;
                });


                this.toolsContainer.addChild(leftButton)



                var rightButton = new PIXI.Sprite(arrowTextures.normal)
                rightButton.interactive = true;
                rightButton.addListener("pointertap", () => {
                    if(this.ToolScrollbox.scrollLeft >= window.innerWidth/2) return;

                    //console.log(getTimeElapsed(timePointerDown) < 0.15)
                    if (getTimeElapsed(timePointerDown) < 0.15)
                        ease.add(this.ToolScrollbox.content, { scrollLeft: 500 }, { duration: 500, ease: "linear" })
                });
                rightButton.addListener("pointerdown", () => {
                    if(this.ToolScrollbox.scrollLeft >= window.innerWidth/2) return;

                    rightButton.texture = arrowTextures.pressed;

                    timePointerDown = new Date().getTime();

                    ease.removeEase(this.ToolScrollbox.content)
                    this.ToolBeltMovingRight = true;
                });
                rightButton.addListener("pointerup", () => {
                    this.ToolBeltMovingRight = false;
                    rightButton.texture = arrowTextures.normal;
                });
                rightButton.addListener("pointerupoutside", () => {
                    this.ToolBeltMovingRight = false;
                    rightButton.texture = arrowTextures.normal;

                });

                rightButton.scale.set(-0.5)
                rightButton.position.set(window.innerWidth - 46, 0);
                rightButton.anchor.set(1, 1)
                this.toolsContainer.addChild(rightButton)

            }

            function getTimeElapsed(time) {
                return (new Date().getTime() - time) / 1000;
            }

            this.toolsContainer.position.set(0, window.innerHeight - 180);

            this.player.refreshAccessories()
        }
    }


    initObstacles() {
        var items = this.sceneryManager.getAllItems(undefined, false);
        items = items.filter((item) =>
            item.isObstacle
        );
        items.forEach(item => {
            this.sceneryManager.registerSceneryManager(item);
        });
    }

    moveToInit() {
        let initPosition = this.sceneryManager.sceneryManifests.initPosition;
        this.player.moveToPosition(initPosition);
    }

    initEvents(sceneryManager) {
        var Events = require("./events").default;
        this.events = new Events(sceneryManager);
        this.events.register();
    }

    adaptViewportToSize(mapWidth, mapHeight, center = false) {
        this.viewport.worldHeight = mapHeight * 32;
        this.viewport.worldWidth = mapWidth * 32;
        if (center) {
            let pos = this.viewport.toWorld(this.player)
            this.viewport.left = pos.x - (window.innerWidth / 2);
            this.viewport.top = pos.y - (window.innerHeight / 2);
        }
    }

    initViewport() {
        var activeScenery = this.sceneryManager.visibleScenery;
        var mapWidth = activeScenery.SceneryLoader.tiled.mapJson.width;
        var mapHeight = activeScenery.SceneryLoader.tiled.mapJson.height;
        var canOpenAvailableShop = gameService.canOpenAvailableShop();

        this.viewport.top = 0;
        this.viewport.left = 0;
        this.adaptViewportToSize(mapWidth, mapHeight, true);
        this.viewport.follow(this.player);
        this.viewport.clamp({ direction: 'all' });

        this.carEntrace = new EscapeCar(this.sceneryManager);
        this.sceneryContainer.addChild(this.carEntrace);
        var currentPlayedSceneryTimes = gameService.getCurrentSceneryTimes();


        var startEvents = () => {
            

            return this.carEntrace.in().then(() => {
                this.initTools();

                this.player.visible = true;
                this.player.invisible = false;
                
                if (canOpenAvailableShop){
                    let modal = new Modal(Modal.MODAL_CONTENTS.AVAILABLE_TOOLS, () => {
                        this.showMainItemPresentation();
                    });
                    modal.show();
                    DispatchersUser.setUserTutorialUpgradesDone(true);
                }else{
                    this.showMainItemPresentation();
                }
                


                this.viewport.addListener("pointerup", (event) => {
                    this.pressed = false;
                    if (this.mainItemPresentationIsRunning) return true;
                    this.lastMovedPos = null;
                    const { x, y } = event.data.global;
                    const world = this.viewport.toWorld({ x, y })
                    this.eventsHandler.fire(World.EVENTS_HANDLERS.ON_MAP_POINTER_UP, { x: Math.ceil(world.x / 32) - 1, y: Math.ceil(world.y / 32) - 1 });
                });
                this.viewport.addListener("pointermove", (event) => {
                    if (this.mainItemPresentationIsRunning) return true;

                    if (this.pressed === true) {
                        const { x, y } = event.data.global;
                        const world = this.viewport.toWorld({ x, y })
                        const gamePosition = { x: Math.ceil(world.x / 32) - 1, y: Math.ceil(world.y / 32) - 1 };
                        if (this.lastMovedPos == null || (this.lastMovedPos.x !== gamePosition.x || this.lastMovedPos.y !== gamePosition.y)) {
                            this.lastMovedPos = gamePosition;
                            this.eventsHandler.fire(World.EVENTS_HANDLERS.ON_MAP_POINTER_MOVE, gamePosition);
                            this.lastMovedPos = gamePosition;
                        }
                    }
                });
                this.viewport.addListener("pointerdown", (event) => {
                    this.pressed = true;

                    if (this.mainItemPresentationIsRunning) {
                        if (currentPlayedSceneryTimes > 0)
                            this.stopMainItemPresentation();
                        return true;
                    }
                    const { x, y } = event.data.global;
                    const world = this.viewport.toWorld({ x, y })
                    const gamePosition = { x: Math.ceil(world.x / 32) - 1, y: Math.ceil(world.y / 32) - 1 };
                    this.lastMovedPos = gamePosition;
                    this.eventsHandler.fire(World.EVENTS_HANDLERS.ON_MAP_POINTER_DOWN, gamePosition);
                });
            });
        }

        if (currentPlayedSceneryTimes > 0)
            startEvents()
        else {
            let modal = new Modal(Modal.MODAL_CONTENTS.SHOW_MAIN_ITEM, startEvents);//end modal
            modal.show();
        }
    }



    getAllDangers() {
        return this.dangersContainer.children;
    }
    
    getDangerByID = memoize((creatureId)=>{
        return _.findWhere(this.getAllDangers(), {creatureId: creatureId});
    })

    getAllCreatures() {
        return _.union(this.dangersContainer.children, [this.player])
    }

    respawnDanger(dangerName, initialX, initialY, initialZ, waypoints, speed = 400) {
        let danger = new Danger(dangerName, dangerName, waypoints, speed);
        this.sceneryManager.registerSceneryManager(danger);
        danger.setPosition(initialX, initialY, initialZ);
        danger.zIndex = 2;
        this.dangersContainer.addChild(danger);
    }

    respawnDangerSurveillance(dangerName, initialX, initialY, initialZ, waypoints, speed = 400, minAngle, maxAngle,revert, type) {
        let danger = new Danger(dangerName, dangerName, waypoints, speed, minAngle, maxAngle,revert, type);
        this.sceneryManager.registerSceneryManager(danger);
        danger.setPosition(initialX, initialY, initialZ);
        danger.zIndex = 2;
        danger.minAngle = minAngle;
        danger.maxAngle = maxAngle;
        danger.type = type;
        //if(speed == 0){
        //}
        this.dangersContainer.addChild(danger);
    }





    // Main Item Presentation



    stopMainItemPresentation() {
        let viewport = this.viewport;
        viewport.follow(this.player, { speed: 0 });
        this.sceneryManager.ticker.remove(this.presentationHandler);
        this.mainItemPresentationIsRunning = false;
    }


    showMainItemPresentation() {
        // TODO - FIX BELOW LINE
        var specialLoot = this.sceneryManager.getAllItemsByAttributes({ lootable: true }, false).find((item) => (
            item.specialLoot
        ));


        let finalCameraPos = specialLoot?.gamePosition;
        if (!finalCameraPos) return true;

        let startedTime = null;
        let waypoints = this.player.getWaypointsTo(this.player.gamePosition, finalCameraPos);
        let cameraPositionBeforeMovement = null;

        let lastX = null;
        let lastY = null;
        var countdown = 0;
        var first = true;
        this.presentationHandler = () => {
            this.mainItemPresentationIsRunning = true;
            var distance = null;
            let reached = false;

            if (lastX !== null && lastY !== null) {
                distance = getDistance(lastX, lastY, this.sceneryManager.worldInstance.viewport.x, this.sceneryManager.worldInstance.viewport.y)

                if (distance <= 0.1)
                    reached = true
            }

            lastX = this.sceneryManager.worldInstance.viewport.x
            lastY = this.sceneryManager.worldInstance.viewport.y



            if (reached) {

                countdown -= (1 / 60);

                if (countdown <= 0) {
                    countdown = waypoints.length == 1 ? 3 : 0 // 0.2;
                    if (waypoints.length > 0) {
                        let pos = waypoints.shift();
                        showPosition(pos, this.sceneryManager, cameraPositionBeforeMovement);
                        cameraPositionBeforeMovement = pos.toPosition;
                    } else {
                        this.stopMainItemPresentation();
                    }
                }
            }


            first = false;
        }
        this.sceneryManager.ticker.add(this.presentationHandler);


        function getDistance(xA, yA, xB, yB) {
            var xDiff = Math.abs(xA) - Math.abs(xB);
            var yDiff = Math.abs(yA) - Math.abs(yB);
            return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        }

        function getUpdatedModeTimeElapsed(time) {
            return (new Date().getTime() - time) / 1000;
        }
        function showPosition(toPos, sceneryManager, cameraPositionBeforeMovement) {
            let viewport = sceneryManager.worldInstance.viewport;
            let visibleZ = sceneryManager.visibleZ;
            if (!viewport.pointer) {
                viewport.pointer = new PIXI.Sprite(PIXI.Texture.EMPTY);
                viewport.addChild(viewport.pointer)
            }
            viewport.follow(viewport.pointer, { speed: 2 * window.devicePixelRatio });
            viewport.pointer.position.set((toPos.x * 32) - 16, (toPos.y * 32) - 16);
            if (toPos.z !== visibleZ) {
                sceneryManager.setVisibleFloor(toPos.z)
                if (cameraPositionBeforeMovement) {
                    viewport.left = (cameraPositionBeforeMovement.x * 32) - (window.innerWidth / 2);
                    viewport.top = (cameraPositionBeforeMovement.y * 32) - (window.innerHeight / 2);
                }
            }
        }
    }

}

export default World;