
import TiledLoader from '../utils/tiled/loader';
import Scenery from './scenery';
import _ from 'underscore';
import Item from './item';
import { ease } from 'pixi-ease';
import { OutlineFilter } from '@pixi/filter-outline';
import memoizee from 'memoizee'



const PIXI = require("pixi.js"),
    { Texture, Container, Sprite } = PIXI;

var cache = [];

export default class SceneryLoader {


    static maps = {
        "1.Storefront": { manifest: require("../../../../processed/tmx/1. Store Front").default, baseSceneryImage: "gameplay/sceneries/1. Store Front.png", zFloor: 0 },
        "2.Bakery": { manifest: require("../../../../processed/tmx/2.Bakery").default, baseSceneryImage: "gameplay/sceneries/2.Bakery.png", zFloor: 0 },
        "3.Wallmart": { manifest: require("../../../../processed/tmx/3.Wallmart").default, baseSceneryImage: "gameplay/sceneries/3.Wallmart.png", zFloor: 0 },
        "3.Wallmart_level_a": { manifest: require("../../../../processed/tmx/3.Wallmart_level_a").default, baseSceneryImage: "gameplay/sceneries/3.Wallmart_level_a.png", zFloor: 1 },
        "4.TGI_Mondays": { manifest: require("../../../../processed/tmx/4.TGIMondays").default, baseSceneryImage: "gameplay/sceneries/4.TGIMondays.png", zFloor: 0 },
        "5.Yeezi_Store": { manifest: require("../../../../processed/tmx/5.Yeezi_store_floor").default, baseSceneryImage: "gameplay/sceneries/5.Yeezi_store_floor.png", zFloor: 0 },
        "5.Yeezi_Store_b": { manifest: require("../../../../processed/tmx/5.Yeezi_store_level_a").default, baseSceneryImage: "gameplay/sceneries/5.Yeezi_store_level_a.png", zFloor: 1 },
        "6.Mall_floor": { manifest: require("../../../../processed/tmx/6.Mall_floor").default, baseSceneryImage: "gameplay/sceneries/6.Mall_floor.png", zFloor: 0 },
        "6.Mall_floor_a": { manifest: require("../../../../processed/tmx/6.Mall_level_a").default, baseSceneryImage: "gameplay/sceneries/6.Mall_level_a.png", zFloor: 1 },
        "7.Prideaux_floor": { manifest: require("../../../../processed/tmx/7.Prideaux_floor").default, baseSceneryImage: "gameplay/sceneries/7.Prideaux_floor.png", zFloor: 0 },
        "7.Prideaux_level_a": { manifest: require("../../../../processed/tmx/7.Prideaux_level_a").default, baseSceneryImage: "gameplay/sceneries/7.Prideaux_level_a.png", zFloor: 1 },
        "7.Prideaux_level_b": { manifest: require("../../../../processed/tmx/7.Prideaux_level_b").default, baseSceneryImage: "gameplay/sceneries/7.Prideaux_level_b.png", zFloor: 2 },
        "8.Maximum": { manifest: require("../../../../processed/tmx/8.Maximum").default, baseSceneryImage: "gameplay/sceneries/8.Maximum.png", zFloor: 0 },
        "8.Maximum_level_a": { manifest: require("../../../../processed/tmx/8.Maximum_level_a").default, baseSceneryImage: "gameplay/sceneries/8.Maximum_level_a.png", zFloor: 1 },
        "devMap": { manifest: require("../../../../processed/tmx/devMap").default, baseSceneryImage: "gameplay/sceneries/devMap.png", zFloor: 0 }
    }

    /**
     * 
    * @param {string} mapName
     * @param {Scenery} sceneryRef 
     */
    constructor(sceneryRef) {

        this.mapName = sceneryRef.sceneryBaseName;
        this.manifestMap = SceneryLoader.maps[this.mapName].manifest;
        this.zFloor = SceneryLoader.maps[this.mapName].zFloor;
        this.baseSceneryImage = SceneryLoader.maps[this.mapName].baseSceneryImage;

        this.tiled = new TiledLoader(this.manifestMap, this.mapName);
        this.sceneryRef = sceneryRef;

        this.getTiledItems = memoizee((tiledId) => {
            return _.findWhere(this.items, { tiledId });
        });

    }

    getBackgroundFloor(width, height) {
        const voidFloor = Sprite.from(Texture.WHITE);
        voidFloor.cacheAsBitmap = true;
        voidFloor.width = width;
        voidFloor.height = height;
        voidFloor.tint = 0xFF0000;
        return voidFloor;
    }

    _generateItemByTiledId(tiledId, fliped) {
        let info = this.getTiledItems(tiledId);
        if (info) {
            if (!fliped) {
                fliped = { isHorizontalFliped: false, isVerticalFliped: false, isDiagonalFliped: false }
            }
            var obstacle = info.extraData.properties?.obstacle;
            if (obstacle) {
                var obstacleClass = undefined;
                try {
                    var lodash = require("lodash");
                    var obstacleFile = lodash.camelCase(obstacle);
                    obstacleClass = require("./obstacles/" + obstacleFile).default;
                } catch (err) {
                    console.error(err)
                    throw new Error("Maybe the obstacle class wasn't found at path ./obstacles/" + obstacleFile)
                }
                if (!obstacleClass.prototype instanceof Item) {
                    throw new Error("Obstacle class must inherit from Item class");
                }
                return new obstacleClass(info.texture, info.extraData, fliped);
            }
            return new Item(info.texture, info.extraData, fliped);
        }
    }

    preCache() {
        return new Promise((resolve) => {

            let container = this.getSceneryContainer();

            if (!cache[this.mapName]) {
                window.gameApp.renderer.plugins.prepare.add(container)

                window.gameApp.renderer.plugins.prepare.upload(() => {
                    cache[this.mapName] = container;
                    resolve();
                });
            }
        });
    }
    /**
     * @returns {PIXI.Container}
     */
    getSceneryContainer() {
        this.items = this.tiled.getTiles();

        if (cache[this.mapName]) {
            return cache[this.mapName];
        }



        let container = new Container();
        let tileLayers = _.where(this.tiled.mapJson.layers, { type: "tile" });
        let containerObstacle_ = new Container();
        tileLayers.forEach(layer => {
            var data = layer.tiles;

            for (let i = 0; i < data.length; i++) {

                if (data[i]) {
                    let properties = data[i].properties;


                    if (properties.obstacle === undefined && properties.lootable !== true) // If not an obstacle, don't do anything
                        continue;

                    //PIXI.Loader.shared.resources["images/ui_textures.json"].textures
                    let isHorizontalFliped = layer.horizontalFlips[i];
                    let isVerticalFliped = layer.verticalFlips[i];
                    let isDiagonalFliped = layer.diagonalFlips[i];
                    let tiledID = data[i].gid;
                    let item = this._generateItemByTiledId(tiledID, { isHorizontalFliped, isVerticalFliped, isDiagonalFliped });
                    if (item.alpha !== 1)
                        item.alpha = layer.opacity;

                    let x = i % (this.tiled.mapJson.width);
                    let y = Math.floor(i / (this.tiled.mapJson.width));


                    if (item) {
                        item.setPosition(x, y, this.zFloor);
                        let properties = item.extraData?.properties;
                        if (properties?.last_item) {
                            item.specialLoot = true;
                            let specialItemframe = this.getSpecialLootFrame();
                            specialItemframe.position.set((x * 32) + 16, (y * 32) + 16);
                            containerObstacle_.addChild(specialItemframe);

                            item.highlightFrame = specialItemframe;
                        }
                        containerObstacle_.addChild(item);
                    }
                }
            }
        });


        let containerBase = new PIXI.Container();
        let texture = PIXI.Loader.shared.resources[this.baseSceneryImage].texture

        containerBase.addChild(new PIXI.Sprite(texture));
        containerBase.type = Scenery.CONTAINER_TYPE.STATIC;
        container.addChild(new PIXI.Sprite.from(texture));


        containerObstacle_.type = Scenery.CONTAINER_TYPE.OTHERS;
        containerObstacle_.interactiveChildren = false;
        container.addChild(containerObstacle_);

        return container
    }





    generateRandomMap() {
        let container = this.getSceneryContainer();
        //this.generateRandomLoot(container);
        return container;
    }

    getSpecialLootFrame() {
        let textures = PIXI.Loader.shared.resources["gameplay/textures.json"];
        let highlightTexture = textures.spritesheet.animations["maps/Shared Elements/highlight/highlight"];
        let highlightSprite = new PIXI.AnimatedSprite(highlightTexture);
        highlightSprite.animationSpeed = 0.1
        highlightSprite.play()
        highlightSprite.position.set(16, 16);
        highlightSprite.anchor.set(0.5)
        return highlightSprite;
    }

    generateRandomLoot(container) {
        
        var listLoots = _.filter(this.tiled.mapJson.lootables, (item) => (
            !!item.gid && !item.properties.coins
        ));

        var lootAreas = _.findWhere(this.tiled.mapJson.layers, { name: "lootArea" })
        if (!lootAreas) return true;

        var areas = [];
        lootAreas.objects.forEach(lootArea => {
            var initX = lootArea.x;
            var initY = lootArea.y;
            var maxX = initX + (lootArea.width) - 1;
            var maxY = initY + (lootArea.height) - 1;
            // Properties
            var amount = lootArea.properties.amount;
            var baseWorthy = lootArea.properties.baseWorthy;

            var availableSpace = [];
            for (let x = initX; x < maxX; x++) {
                for (let y = initY; y < maxY; y++) {
                    availableSpace.push({ x, y, baseWorthy })
                }
            }
            areas.push({ initX, initY, maxX, maxY, amount, baseWorthy, availableSpace });
        });



        areas = _.map(areas, (item) => {
            const { amount, availableSpace } = item;
            item.availableSpace = amount ? _.sample(availableSpace, amount) : item.availableSpace;
            return item;
        });

        var positionToBePlaced = []

        areas.forEach(item => {
            var amount = item.amount
            if (amount) {
                let availableSpaces = _.sample(item.availableSpace, amount)
                positionToBePlaced = _.union(positionToBePlaced, availableSpaces)
            }
        });


        var totalLoot = this.manifestMap.lootAmount - positionToBePlaced.length;
        if (totalLoot > 0) {
            positionToBePlaced = _.union(positionToBePlaced, _.sample(_.flatten(_.pluck(areas, "availableSpace")), totalLoot))
        }

        positionToBePlaced.forEach(posObj => {
            const { x, y, baseWorthy } = posObj
            var lootItem = _.sample(listLoots);
            var item = this._generateItemByTiledId(lootItem.gid);

            if (item) {
                item.baseWorthy = baseWorthy;
                this.sceneryRef.register(item);
                item.setPosition(x, y, this.zFloor);
                container.addChild(item)
            }
        });
    }


    animateLoots(container) {
        let items = _.flatten(_.pluck(container.children, "children"));
        let lootable = items.filter((item) => (
            item.extraData?.properties?.lootable === true
        ));

        lootable.forEach(item => {
            if (item.originalPos) {
                item.position.set(item.originalPos.x, item.originalPos.y);
            }
            item.took = false;
            item.alpha = 1
            item.scale.set(0.9);
            item.cacheAsBitmap = true;
            item.cacheAsBitmap = false;
            item.filters = [new OutlineFilter(2, 0xFFFFFF, 1)]
            item.cacheAsBitmap = true;
        });
        ease.add(lootable, { scale: 0.75 }, { duration: 1200, repeat: true, reverse: true });
    }

    load() {
        return new Promise((resolve) => {
            let container = this.generateRandomMap();

            this.animateLoots(container);

            this.sceneryRef.addChild(container);

            resolve(true);
        });
    }
}