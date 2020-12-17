import _ from 'underscore'
import { pathToMovivementsArray } from '../utils/matrix'
import EventsHandler from '../utils/eventsHandler';
import Creature from './creature';
import Danger from './danger';
import World from './world';
import PF from 'pathfinding'
import SceneryLoader from './sceneryLoader';
import Fov from "./fov"
import { spawn, Thread, Worker } from "threads"
import GameService from '@/stages/game/scripts/core/services/GameService';




const PIXI = require("pixi.js"),
    { Container } = PIXI;

export default class Scenery extends Container {


    static CONTAINER_TYPE = {
        OTHERS: "others",
        STATIC: "static",
        CREATURES: "creatures"
    }

    static preLoad() {
        return new Promise((resolve) => {

            // let sceneries = GameService.getSceneries();
            // console.log(sceneries); //id

            // var asyncs = [];
            // _.keys(SceneryLoader.maps).forEach(sceneryBaseName => {
            //     for (let i = 0; i < sceneries.length; i++) {
            //         if (sceneries[i].id.includes(sceneryBaseName) && sceneries[i].locked === false) {
            //             let scenery = new Scenery(sceneryBaseName);
            //             asyncs.push(scenery.preCache());
            //             console.log("Cache de: " + sceneryBaseName);
            //         }
            //     }
            // });

            var asyncs = [];
            _.keys(SceneryLoader.maps).forEach(sceneryBaseName => {
                let scenery = new Scenery(sceneryBaseName);
                asyncs.push(scenery.preCache());
            });
            Promise.all(asyncs).then(() => {
                resolve();
            });
        })
    }

    constructor(sceneryBaseName, sceneryManager) {
        super();
        this.sceneryManager = sceneryManager;



        this.sceneryBaseName = sceneryBaseName;
        this.zFloor = undefined;

        this.car = null;



        this.eventsHandler = new EventsHandler("SCENERY", this);
        this.fovContainer = new Container();
        this.arrowContainer = new Container();
        this.creaturesContainer = new Container();
        this.creaturesContainer.sortableChildren = true;

        this.creaturesContainer.type = Scenery.CONTAINER_TYPE.CREATURES;


        this.player = null;
        this.SceneryLoader = new SceneryLoader(this);
        this.playerReady = false;
        EventsHandler.subscribe(World.EVENTS_HANDLERS.ON_SCENERY_UNLOADED, () => {
            if (this.fovWorker)
                Thread.terminate(this.fovWorker);

        });



    }



    getAllItems() {
        return _.flatten(_.pluck(_.flatten(_.pluck(this.children, "children")), "children"));
    }

    getAllItemsByAttributes(attributes) {
        var registeredItems = this.getAllItems();
        if (attributes) {
            return registeredItems.filter((item) => {
                return item.extraData && _.isMatch(item.extraData.properties, attributes);
            });
        }
        return registeredItems;
    }


    preCache() {
        return new Promise((resolve) => {
            this.SceneryLoader.preCache().then(() => {
                resolve();
            });
        })
    }

    init(zFloor) {
        this.zFloor = zFloor;

        return new Promise((resolve) => {
            this.SceneryLoader.load().then(() => {
                this.registerPathFinding();
                this.addChild(this.arrowContainer);
                this.addChild(this.fovContainer);
                this.addChild(this.creaturesContainer);
                this.initFov().then(() => {
                    resolve();
                });
            });
        })
    }



    async initFov() {
        let manifest = this.SceneryLoader.tiled.mapJson;
        this.fovWorker = await spawn(new Worker("./workers/fov"))
        await this.fovWorker.init(manifest.width * 32, manifest.height * 32);
        await this.fovWorker.execute("start");
        await this.refreshCollisionPolygon();
    }

    async toggleCollisionPolygonEnabled(fovID,status){
        await this.fovWorker.execute("setPolygonEnabledStatus", fovID, status);
    }

    async refreshCollisionPolygon() {
        var collisionPolygons = [...this.SceneryLoader.tiled.mapJson.collisionPolygons];

        if (!collisionPolygons) { // The slow and last chance to get some polygons to the FOV
            console.warn("You are using the slow version")
            let matrix = this.PFgridFOV.nodes.map((rowY) => (
                rowY.map((rowX) => (
                    rowX.walkable === false ? 1 : 0
                ))
            ));
            collisionPolygons = Fov.getPolygonsByCollisionMatrix(matrix);
        }



        let doors = this.getAllItemsByAttributes({ obstacle: "door" });

        doors.forEach((door) => {
            let x = door.gamePosition.x;
            let y = door.gamePosition.y;

            let collisionBox = [];
            collisionBox.push(x * 32, y * 32);
            collisionBox.push((x + 1) * 32, y * 32);
            collisionBox.push((x + 1) * 32, (y + 1) * 32);
            collisionBox.push(x * 32, (y + 1) * 32);

            let fovID = Math.random()*10000001|0;
            door.fovID = fovID;

            collisionPolygons.push({ coords: collisionBox, fovID });
        });

        let fragileGlass = this.getAllItemsByAttributes({ obstacle: "fragile_glass" });
        fragileGlass.forEach((glass) => {
            let collisionBox = glass.getCollisionShape();
            if (!collisionBox) return true;




            
            let fovID = Math.random()*10000001|0;
            glass.fovID = fovID;

            collisionPolygons.push({ coords: collisionBox, fovID });
        });

        await this.fovWorker.execute("updatePolygons", collisionPolygons);
    }

    async updateFov() {


        if (!this.fovWorker) return { detected: 0, detectedObservers: [] };



        function isCollide(a, b) {
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );
        }
        let visibleBounds = this.sceneryManager.worldInstance.viewport.getVisibleBounds();
        const extraSpace = 150;
        visibleBounds.x -= extraSpace;
        visibleBounds.y -= extraSpace;
        visibleBounds.width += extraSpace * 2;
        visibleBounds.height += extraSpace * 2;


        // UPDATE PLAYER
        let playerPosition = this.sceneryManager.worldInstance.player;




        // UPDATE DANGERS
        let dangers = _.filter(this.sceneryManager.worldInstance.getAllDangers(), (item) => {
            let collide = isCollide(item, visibleBounds);

            if (collide && item.gamePosition.z === this.zFloor) {
                item.visible = true;
            } else
                item.visible = false;

            return item.gamePosition.z === this.zFloor && collide

        });
        if (GameService.isInDevMap())
            dangers.push(this.sceneryManager.worldInstance.player)

        let observers_ = [];

        dangers.forEach((danger) => {
            if (danger instanceof Danger )
            danger.detectPlayer();

            let angle = danger.bodyContainer.rotation;
            let xx = danger.x + (64 * Math.cos(angle));
            let yy = danger.y + (64 * Math.sin(angle));
            if (danger.type !== "neutral")
                observers_.push({ x: danger.x, y: danger.y, lookAt: [xx, yy], extraData: { creatureId: danger.creatureId }, coneTint: danger.coneTint, coneAlpha: danger.coneAlpha })
        });

        let { observers, updated } = await this.fovWorker.execute("updateObserversAndUpdate", observers_, { x: playerPosition.x, y: playerPosition.y });

        // UPDATE FOV CONE
        this.fovContainer.removeChildren();


        var fovs = observers.map((observer) => (
            getGraphicFoV(observer.fov, observer.sector, observer.coneColour, observer.coneAlpha)
        )).filter((v) => v !== undefined)



        function getGraphicFoV(fig, sector, coneColour, coneAlpha) {

            if (!sector.centre || !fig) return;
            let graphic = new PIXI.Graphics();
            graphic.clear()
            graphic.beginFill(coneColour ? coneColour : 0xffffff, (coneAlpha !== undefined && coneAlpha !== null) ? coneAlpha : 0.35);
            graphic.moveTo(sector.centre[0], sector.centre[1]);
            for (var i = 0, len = fig.hitPoints.length; i < len; ++i) {
                var p = fig.hitPoints[i];
                var cp = fig.ctrlPoints[i];
                if (cp)
                    graphic.quadraticCurveTo(cp[0], cp[1], p[0], p[1]);
                else
                    graphic.lineTo(p[0], p[1]);
            }
            graphic.closePath();
            graphic.endFill();

            return graphic;
        }

        if (fovs.length > 0) {
            fovs.forEach(fov => {
                this.fovContainer.addChild(fov);
            });
        }

        return updated;
    }


    registerPathFinding() {
        var pf_matrix = [...this.SceneryLoader.tiled.mapJson.collisionMatrix];
        this.PFgrid = new PF.Grid(pf_matrix);
        this.PFfinder = new PF.BiAStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });
    }

    updateMatrix(x, y, walkable) {
        try {
            return this.PFgrid.setWalkableAt(x, y, walkable);
        } catch (e) {
            //console.error("ERROR: "+e.message);
        }
    }



    isPositionWalkable(posX, posY) {

        if (this.PFgrid) {
            return this.PFgrid.isWalkableAt(posX, posY);
        }
        console.error("PFGrid wasn't started yet.")
        return false;
    }

    tracePath(fromPos, toPos) {
        var grid;

        grid = this.PFgrid.clone();

        var paths = [];
        try {
            paths = this.PFfinder.findPath(fromPos.x, fromPos.y, toPos.x, toPos.y, grid);
        } catch (error) {

        }
        return pathToMovivementsArray(paths);
    }

    getObjectPropertiesFromPosition(x, y, properties) {
        var objects = _.flatten(_.pluck(_.where(this.SceneryLoader.tiled.mapJson.layers, { type: "object" }), "objects"));

        if (x && y) {
            objects = objects.filter((item) => (
                item.x === x && item.y === y
            ));
        }
        if (properties) {
            return objects.filter((item) => {
                return item.properties && _.isMatch(item.properties, properties);
            });
        }
        return objects;
    }


    addCreatureAtPos(creatureid, x, y) {
        var creature = new Creature(creatureid);
        creature.setPosition(x, y);
        this.addChild(creature);
        this.register(creature);
        return creature;
    }

    addItemAtPos(item, x, y, debug) {
        item.setPosition(x, y);
        this.addChild(item);
        this.register(item);
        return item;
    }









}