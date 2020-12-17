
import ObjectItem from './object';
import World from './world';
import Creature from './creature';
import CreatureMovement from './creatureMovement'
import { transformGamePositionToCoord, getPosByDirection } from '../utils/matrix'
import DrawArrow from '../utils/drawArrow'
import GameService from '@/stages/game/scripts/core/services/GameService'
import _ from 'underscore';
import EventsHandler from '../utils/eventsHandler';
import Sounds from '@/stages/game/scripts/core/sound';

const PIXI = require("pixi.js"),
    { Container } = PIXI;

export default class Player extends Creature {

    static EVENTS_HANDLERS = {
        ON_PLAYER_GET_LOOT: "ON_PLAYER_GET_LOOT"
    };

    static PLAYER_BONUS = {
        "SPEED_MULTIPLIER": "SPEED_MULTIPLIER",
        "CCTV_INEFFECTIVE": "CCTV_INEFFECTIVE"
    }

    constructor() {
        super("MainCharacter");
        this.refreshAccessories();
        this.isPlayer = true;
        this.registerKeyboard();
        this.registerArrowMoviment();

        this.eventsHandler.subscribe(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED, () => {
            this.registerClickScenery();
            EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_LOADED, () => {
                this.visibleSceneryHandler();
            });
            EventsHandler.subscribe([World.EVENTS_HANDLERS.ON_PLAYER_GET_CAUGHT,World.EVENTS_HANDLERS.ON_PLAYER_COMPLETE_LEVEL,World.EVENTS_HANDLERS.ON_SCENERY_UNLOADED], () => {
                this.sounds.walking.stop();
            });
        });

        
        //  if (!window.fbEnv)
        //      this.speed = 50;

        this.sounds = {
            walking: new Sounds("footsteps-1", {
                volume: 0.9,
                rate: 1,
                loop: true
            })
        }
            
        this.baseSpeed = this.speed;
        this.initBonus();
    }

    holdItem(item){
        let resources = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;

        var mainItems = require("@/stages/game/manifests/mainItems.json");
        let sourceImage = item.extraData.image.source;
        let mainItem = _.findWhere(mainItems,{texture:sourceImage });
        if (!mainItem)
            throw new Error("Main item was not found.");

        let texturePath = "maps/Characters/MainCharacterHolding/MainItemsToHold/"+mainItem.texture_holding;
        let itemOnHand = new PIXI.Sprite(resources[texturePath]);

        if (!itemOnHand)
            throw new Error("Main item's texture was not found at " + texturePath)

        this.creatureRenderer._renderItemOnHand(itemOnHand);
        this.creatureRenderer._renderBody("MainCharacterHolding");
    }

    visibleSceneryHandler() {
        this.sceneryManager.ticker.add(() => {
            if (this.sceneryManager.visibleZ !== this.gamePosition.z) {
                let viewport = this.sceneryManager.worldInstance.viewport;
                if (viewport.plugins.get("follow")?.target instanceof Player) {
                    this.sceneryManager.setVisibleFloor(this.gamePosition.z);
                }
            }
        });
    }

    refreshAccessories() {
        this.creatureRenderer._renderAccessories(GameService.getCurrentPlayerHat().texture, GameService.getCurrentPlayerBackpack().texture)
    }

    checkHasBonus(bonus) {
        return this.bonus.indexOf(bonus) > -1;
    }

    initBonus() {
        this.bonus = [];
        var inventory = GameService.getUserInventory() ?? [];

        var allInventory = [...inventory];
        var currentHat = GameService.getCurrentPlayerHat();
        var currentBackpack = GameService.getCurrentPlayerBackpack();

        if (currentHat) {
            allInventory.push({
                id: currentHat.id
            });
        }
        if (currentBackpack) {
            allInventory.push({
                id: currentBackpack.id
            });
        }

        allInventory.forEach(inventoryItem => {
            var item = GameService.getItem(inventoryItem.id);
            var bonus = item.bonus;

            if (Array.isArray(bonus)) {
                bonus.forEach(effect => {
                    let name = effect.name;
                    let value = effect.value;
                    if (name === Player.PLAYER_BONUS.SPEED_MULTIPLIER) {
                        this.speed = this.baseSpeed * value;
                    } else if (name === Player.PLAYER_BONUS.CCTV_INEFFECTIVE) {
                        this.CCTV_INEFFECTIVE = true
                    }
                    this.bonus.push(name)
                });
            }
        });

    }

    registerClickScenery() {
        this.sceneryManager.worldInstance.eventsHandler.subscribe([World.EVENTS_HANDLERS.ON_MAP_POINTER_DOWN, World.EVENTS_HANDLERS.ON_MAP_POINTER_MOVE], (posClicked, eventType) => {

            if (posClicked.x !== this.gamePosition.x || posClicked.y !== this.gamePosition.y) {
                this.moveToPosition({ ...posClicked, z: this.gamePosition.z }, false, undefined, true);
            }

            if (eventType === World.EVENTS_HANDLERS.ON_MAP_POINTER_DOWN) {
                this.pointerClicked = true
            } else if (eventType === World.EVENTS_HANDLERS.ON_MAP_POINTER_UP) {
                this.pointerClicked = false
            }
        });



    }

    registerArrowMoviment() {
        let movements = this.movements;
        const CRETURE_MOVEMENTS_EVENTS = CreatureMovement.EVENTS_HANDLERS;


        movements.eventsHandler.subscribe([CRETURE_MOVEMENTS_EVENTS.ON_PATH_SET], (directions) => {
            if (this.arrow) {
                this.arrow.destroy();
            }
            this.drawArrow(directions);
            this.sounds.walking.play();
        });
        movements.eventsHandler.subscribe(CRETURE_MOVEMENTS_EVENTS.ON_MOVEMENT_FINISHED, () => {
            let last = this.arrow.children.shift()
            if (last)
                last.destroy();
        })
        movements.eventsHandler.subscribe([CRETURE_MOVEMENTS_EVENTS.ON_PATH_FINISHED, CRETURE_MOVEMENTS_EVENTS.ON_PATH_CANCELED], (paths, eventType) => {
            if (this.arrow) {
                this.arrow.destroy();
            }
        });

        movements.eventsHandler.subscribe(CRETURE_MOVEMENTS_EVENTS.ON_PATH_FINISHED, (paths, eventType) => {
            this.sounds.walking.stop();
        });
    }

    drawArrow(directions) {
        let lastGamepos = this.getCreaturePosition();

        var coordinates = [];
        directions.forEach(direction => {
            let current_gamePos = getPosByDirection(lastGamepos, direction[0], direction[1]);
            let current_coordinates = transformGamePositionToCoord(current_gamePos.x, current_gamePos.y);
            lastGamepos = current_gamePos;
            coordinates.push(current_coordinates);
        });

        var lastCoord = coordinates.shift();
        var arrowContainer = new Container();
        coordinates.forEach((coord, index) => {
            let drawArrowEdge = index === (coordinates.length - 1)
            let arrow = DrawArrow(lastCoord.x, lastCoord.y, coord.x, coord.y, drawArrowEdge);
            lastCoord = coord;
            arrowContainer.addChild(arrow)
        });
        this.sceneryManager.upperSceneryContainer.addChild(arrowContainer);
        this.arrow = arrowContainer;
    }


    registerKeyboard() {
        let keyboard = require("../utils/keyboard").default;

        let left = keyboard("ArrowLeft"),
            up = keyboard("ArrowUp"),
            right = keyboard("ArrowRight"),
            down = keyboard("ArrowDown");


        left.press = () => {
            this.state.direction = 'left';
            this.movements.setDirections([['left']], { repeat: true });
        };

        left.release = () => {
            if (this.state.direction === 'left')
                this.movements.cancel();
        };

        //Up
        up.press = () => {
            this.state.direction = 'up';
            this.movements.setDirections([['up']], { repeat: true });
        };
        up.release = () => {
            if (this.state.direction === 'up')
                this.movements.cancel()
        };

        //Right
        right.press = () => {
            this.state.direction = 'right';
            this.movements.setDirections([['right']], { repeat: true });
        };
        right.release = () => {
            if (this.state.direction === 'right')
                this.movements.cancel()
        };

        //Down
        down.press = () => {
            this.state.direction = 'down';
            this.movements.setDirections([['down']], { repeat: true });
        };
        down.release = () => {
            if (this.state.direction === 'down')
                this.movements.cancel()
        };
    }



}