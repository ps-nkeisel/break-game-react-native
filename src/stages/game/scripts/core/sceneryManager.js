import Scenery from './scenery';
import _ from 'underscore';
import { ease } from 'pixi-ease';

const PIXI = require("pixi.js"),
    { Container } = PIXI;

export default class SceneryManager extends Container {

    constructor(sceneryId, worldInstance) {
        super();

        this.ticker = new PIXI.Ticker();
        this.ticker.autoStart = true;
        this.ticker.maxFPS = 60;

        this.tickerFOV = new PIXI.Ticker();
        this.tickerFOV.autoStart = true;
        this.tickerFOV.maxFPS = 50;


        this.sceneryId = sceneryId;
        this.sceneryContainer = new Container();
        this.upperSceneryContainer = new Container();
        this.addChild(this.sceneryContainer);
        this.addChild(this.upperSceneryContainer);
        this.worldInstance = worldInstance;
        let manifests = require("@/stages/game/manifests/scenaries.json");
        this.sceneryManifests = _.findWhere(manifests, { id: this.sceneryId });

        if (!this.sceneryManifests)
            throw new Error("Scenery " + this.sceneryId + " not found in scenaries.json");

        this.visibleScenery = null;
        this.visibleZ = null;
        this.sceneries = [];
    }

    _getSceneryFromZ(z) {
        if (!this.sceneries[z])
            throw new Error("Scenery not found for coordinate " + z + " of Z");
        return this.sceneries[z];
    }

    getObjectPropertiesFromPosition(x, y, z, properties) {
        return this._getSceneryFromZ(z).getObjectPropertiesFromPosition(x, y, properties);
    }

    hasObjectPropertyAtPosition(x, y, z, properties) {
        let test = this.getObjectPropertiesFromPosition(x, y, z, properties);
        return test?.length > 0;
    }

    getStairsFromFloor(z, toPositionZ) {
        var scenery = this._getSceneryFromZ(z);
        let objectLayers = _.findWhere(scenery.SceneryLoader.tiled.mapJson.layers, { type: "object", name: "stairs" });
        if (!objectLayers)
            return null;
        var stairs = [];
        objectLayers.objects.forEach(stair => {
            var obj = { x: stair.x, y: stair.y, properties: stair.properties };
            stairs.push(obj);
        });

        //console.log("toPositionZ: "+toPositionZ);
        if (Number.isInteger(toPositionZ))
            stairs = stairs.filter((item) => (
                item.properties.toPositionZ === toPositionZ
            ));

        return stairs;
    }

    toggleCollisionPolygonEnabled(z, fovID, status) {
        return this._getSceneryFromZ(z).toggleCollisionPolygonEnabled(fovID, status);
    }

    isPositionWalkable(x, y, z) {
        if (z === null || z === undefined)
            throw new Error("Z not defined");

        return this._getSceneryFromZ(z).isPositionWalkable(x, y)
    }

    tracePath(creaturePos, toPos) {
        if (creaturePos.z === null || creaturePos.z === undefined)
            throw new Error("Z not defined");

        return this._getSceneryFromZ(creaturePos.z).tracePath(creaturePos, toPos)
    }

    updateMatrix(x, y, z, walkable, FOVMatrix = false) {
        if (z === null || z === undefined)
            throw new Error("Z not defined");

        return this._getSceneryFromZ(z).updateMatrix(x, y, walkable, FOVMatrix);
    }

    getAllItemsByAttributes(attributes, onlyCurrentFloor = true) {
        var registeredItems = this.getAllItems(onlyCurrentFloor);
        if (attributes) {
            return registeredItems.filter((item) => {
                return item.extraData && _.isMatch(item.extraData.properties, attributes);
            });
        }
        return registeredItems;
    }

    getAllItems(onlyCurrentFloor) {
        if (onlyCurrentFloor) {
            return this.visibleScenery.getAllItems();
        } else
            return _.flatten(_.map(this.sceneries, (scenery) => {
                return scenery.getAllItems();
            }), true);
    }


    setVisibleFloor(z) {
        var sceneryFloor = this._getSceneryFromZ(z);
        if (sceneryFloor) {


            this.sceneries.forEach(scenery => {
                if (scenery != sceneryFloor) {
                    scenery.visible = false;
                    scenery.renderable = false;
                }
            });

            var { width, height } = sceneryFloor.SceneryLoader.tiled.mapJson;
            this.worldInstance.adaptViewportToSize(width, height, true);

            sceneryFloor.renderable = true;
            sceneryFloor.visible = true;
            this.visibleScenery = sceneryFloor;
            this.visibleZ = z;


            if (this.worldInstance.carEntrace)
                if (z > 0)
                    this.worldInstance.carEntrace.renderable = false;
                else
                    this.worldInstance.carEntrace.renderable = true;
        }
    }

    registerSceneryManager(objectItem) {
        objectItem.sceneryManager = this;
        objectItem.onRegistered();
    }

    showTitle() {
        const style = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "MarketDeco",
            fontSize: 42,
            fontWeight: "bold",
            letterSpacing: 1,
            strokeThickness: 1
        });

        var title = new PIXI.Text(this.sceneryManifests.name, style);
        title.anchor.set(0.5, 0);
        title.position.set(window.innerWidth / 2, 80);
        ease.add(title, { scale: 0.5, alpha: 0 }, { duration: 200, wait: 2500 });
        this.worldInstance.upperWorldContainer.addChild(title);
    }

    showGotMainItem(itemName) {
        const style = new PIXI.TextStyle({
            fill: "white",
            fontFamily: "MarketDeco",
            fontSize: 32,
            fontWeight: "bold",
            letterSpacing: 1,
            strokeThickness: 1,
            align: "center",
            // wordWrap: true,
            // wordWrapWidth: window.innerWidth - 10
        });

        var itemText = new PIXI.Text("You got the\n" + itemName + "!\nEscape!", style);
        itemText.anchor.set(0.5, 0);
        itemText.position.set(window.innerWidth / 2, 80);
        ease.add(itemText, { scale: 0.5, alpha: 0 }, { duration: 200, wait: 2500 });
        this.worldInstance.upperWorldContainer.addChild(itemText);
    }


    init() {

        var initPosition = this.sceneryManifests.initPosition;


        var asyncs = [];
        this.sceneryManifests.base.forEach((sceneryBaseName, z) => {

            let scenery = new Scenery(sceneryBaseName, this);
            if (z == initPosition.z) {
                scenery.renderable = true;
                scenery.visible = true;
                this.visibleScenery = scenery;
                this.visibleZ = z;
            } else {
                scenery.visible = false;
                scenery.renderable = false;
            }

            asyncs.push(scenery.init(z));
            this.sceneries.push(scenery);
            this.sceneryContainer.addChild(scenery);
            this.initDangers(scenery, z);
        });

        this.showTitle();

        var working = false;



        this.tickerFOV.add(async () => {
            if (!working) {
                working = true;
                this.detectPlayer(await this.visibleScenery.updateFov());
                working = false
            }
        });

        // this.tickerFOV.add(  () => {
        //     this.detectPlayer(this.visibleScenery.updateFov());
        // });

        return Promise.all(asyncs);
    }

    detectPlayer({ detected, detectedObservers }) {

        if (this.lastDetectedObservers) {
            this.lastDetectedObservers.forEach((item) => {
                let danger = this.worldInstance.getDangerByID(item.extraData.creatureId);
                danger.playerInSight = false;
            });
            this.lastDetectedObservers = undefined;
        }

        if (detectedObservers.length > 0) {
            detectedObservers.forEach((item) => {
                let danger = this.worldInstance.getDangerByID(item.extraData.creatureId);
                danger.playerInSight = true;
            });
            this.lastDetectedObservers = detectedObservers;
        }

    }


    /**
     * 
     * @param {Scenery} scenery 
     */
    initDangers(scenery, z) {
        let objectLayers = _.where(scenery.SceneryLoader.tiled.mapJson.layers, { type: "object" });

        objectLayers.forEach(layer => {
            let dangerName = layer.properties.danger_name;
            var speed = layer.properties.speed;
            var quantity = layer.properties.quantity;
            var type = layer.properties.type || null; //movable or static
            var minAngle = layer.properties.minAngle || null;
            var maxAngle = layer.properties.maxAngle || null;
            let revert = layer.properties.revert || null;
            var type = layer.properties.type || null;

            if (dangerName) {
                let waypoints = _.map(layer.objects, (item) => (
                    {
                        x: item.x,
                        y: item.y,
                        properties: item.properties
                    }
                ));
                if (waypoints.length > 0 && type == null) {
                    waypoints = waypoints.map((item) => (
                        { ...item, z: z }
                    ));
                    let initPos = waypoints[0];
                    this.worldInstance.respawnDanger(dangerName, initPos.x, initPos.y, z, waypoints, speed);
                } else {
                    //render static danger, like cameras, sensors, etc...
                    let waypoints = _.map(layer.objects, (item) => (
                        {
                            x: item.x,
                            y: item.y,
                            properties: item.properties
                        }
                    ));
                    waypoints = waypoints.map((item) => (
                        { ...item, z: z }
                    ));
                    let initPos = waypoints[0];
                    this.worldInstance.respawnDangerSurveillance(dangerName, initPos.x, initPos.y, z, waypoints, speed, minAngle, maxAngle, revert, type);
                }
            }
        });
    }


}