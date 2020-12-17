import TextureTilesetFactory from './TextureTilesetFactory'

const PIXI = require("pixi.js");

export default class TiledLoader {
    preffix;

    static loaded = [];

    constructor(mapJson,mapName) {
        this.preffix = "map-" + mapName + "-";
        this.mapName = mapName;
        this.mapJson = mapJson;
        this.resources = [];
        this._loader = new PIXI.Loader();
    }

    unload() {
        throw new Error("unloadResources - Unimplemented method.");
        //this.mapJson = _.without(this.mapJson, this.mapName);
    }
    

    getResource(image, tileset) {
        if (!image || !image.source){
            return PIXI.Texture.WHITE;
        }
        

        var uri = image.source;
        return PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures[uri];
    }



    getTiles() {
        let tiles = [];
        let tilesets = this.mapJson.tileSets;
        //console.log(tilesets);
        tilesets.forEach(tileset => {
            let textureTilesetFactory = new TextureTilesetFactory(this, tileset);
            if (tileset.image) {
                let tiledSprite = textureTilesetFactory.getManyFromImage();
                tiles = [...tiles, ...tiledSprite];
            } else {
                tileset.tiles.forEach(tile => {
                    if (tile){
                        //if(Math.random(1,101) > 50){
                        let tiledSprite = textureTilesetFactory.getFromTile(tile);
                        tiles.push(tiledSprite);
                        //}
                    }
                });
            }
        });
        return tiles
    }
}