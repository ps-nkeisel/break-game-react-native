
import _ from 'underscore'
const PIXI = require("pixi.js"),
    {  Rectangle } = PIXI;

export default class TextureTilesetFactory {


    constructor(loader, tiledMap) {
        this.loader = loader;
        this.tileSet = tiledMap;
    }

    _makeObject(texture, id, extraData) {
        let object = {};
        object.texture = texture;
        object.tiledId = id;
        object.extraData = extraData;
        return object;
    }

    getFromTile(tile) {
        //console.log("PEGANDO TILE...");
        let firstgid = this.tileSet.firstGid;
        let id = firstgid + tile.id;
        
        let resource = this.loader.getResource(tile.image, this.tileSet);
        

        return this._makeObject(resource, id, tile);
    }

    getManyFromImage() {
        //console.log("PEGANDO IMAGEM...");

        let firstgid = this.tileSet.firstGid;
        let total_x = this.tileSet.image.width / 32;
        let total_y = this.tileSet.image.height / 32;
        let image = this.tileSet.image;
        let texturesObjects = [];
        let count = 0;

        var sizes = {width:this.tileSet.image.width,height: this.tileSet.image.height};

        var resource = this.loader.getResource(image,this.tileSet);
        
        var baseTexture = PIXI.RenderTexture.create(sizes);
        var renderer = PIXI.autoDetectRenderer(sizes)
        var sprite = new PIXI.Sprite(resource);

        renderer.render(sprite, baseTexture);
        var extracted  = renderer.extract.canvas(baseTexture);

        
        for (let y = 0; y < total_y; y++) {
            for (let x = 0; x < total_x; x++) {
                let rectangle = new Rectangle(x * 32, y * 32, 32, 32);
                let id = firstgid + count;
                let properties = { x, y };

                let texture = PIXI.Texture.from(extracted).clone();


                if (!texture)
                    throw new Error("Resource not found:" + image);
                texture.frame = rectangle;

                properties = _.extend(properties, _.findWhere(this.tileSet.tiles, { id: count }));
                texturesObjects.push(this._makeObject(texture, id, properties));
                count++;
            }
        }
        return texturesObjects;
    }
}