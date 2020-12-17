
const path = require('path')
const fs = require('fs')

const _ = require('../node_modules/underscore');
const tmx = require('../node_modules/tmx-parser');


var glob = require('glob');
const { parse, stringify } = require('../node_modules/flatted');

// options is optional
glob("../public/gameplay/**/*.tmx", function (er, files) {
    files.forEach(file => {
        tmx.parseFile(file, (err, mapJson) => {
            if (err) {
                throw new Error("File map error at: " + file + " - " + err)
            }
            mapJson.publicAssetPath = path.relative(`../public/gameplay`, file);

            function _treatURI(uri, tileset) {
                const regex = /\\/g;
                var path = require("path");
                var tilesetPath = path.dirname(path.resolve(path.dirname(file), tileset.source));
                var path_ = path.resolve(tilesetPath, uri)
                path_ = path.relative(path.resolve(__dirname, "../public/gameplay"), path_);
                return path_.replace(regex, "/");
            }


            const regex = /\\/g;

            mapJson.publicAssetPath = mapJson.publicAssetPath.replace(regex, "/")




            if (err) {
                console.log("Error on " + file)
                throw err;
            }

            let layers = _.map(mapJson.layers, (layer) => {
                return _.omit(layer, ["map"])
            });

            mapJson.layers = layers;

            var matrix = Array(mapJson.height).fill(0).map(() => Array(mapJson.width).fill(0));
            var matrix_doors_blockable = Array(mapJson.height).fill(0).map(() => Array(mapJson.width).fill(0));

            mapJson.layers.forEach(layer => {
                if (layer.tiles)
                    layer.tiles.forEach((tile, i) => {

                        var x = i % (mapJson.width);
                        var y = Math.floor(i / (mapJson.width));

                        if (!tile.properties.walkable) {
                            matrix[y][x] = 1;
                            matrix_doors_blockable[y][x] = 1;
                        }
                        if (tile.properties.obstacle == "door") {
                            matrix_doors_blockable[y][x] = 1;
                        }
                    });
            });

            mapJson.layers = mapJson.layers.map(layer => {
                if (layer.type == "object" && layer.name !== "collision") {
                    if (layer.objects.length > 0) {
                        layer.objects = layer.objects.map(item => {
                            return { ...item, x: Math.floor(item.x / 32), y: Math.floor(item.y / 32) }
                        });
                    }
                }
                return layer;
            });

            
            
            
            mapJson.collisionMatrix = matrix;
            mapJson.collisionMatrixWithDoors = matrix_doors_blockable;
            
            
            let collisionLayer = _.findWhere(mapJson.layers, { name: "collision" });
            if (collisionLayer){
                console.log("ENCONTROU COLLISION")
                mapJson.collisionPolygons = transformCollisionLayer(collisionLayer)
            }else{
                mapJson.collisionPolygons = createCollisionPolygons(mapJson.collisionMatrix);
            }


            var lootables = [];
            mapJson.tileSets.forEach(tileset => {
                tileset.source =

                    tileset.tiles.forEach(tile => {
                        if (_.property('lootable')(tile.properties)) {
                            lootables.push(tile);
                        }

                        if (tile.image) {
                            tile.image.source = _treatURI(tile.image.source, tileset);
                        }
                    });
            });
            mapJson.lootables = lootables;


            fs.writeFile(path.join(__dirname, "../src/processed/tmx/", path.basename(file, ".tmx")) + ".js", "export default " + JSON.stringify(mapJson), function (err) {
                if (err) return console.log(err);
                console.log("Saved " + path.basename(file, ".tmx") + " > /src/processed/" + path.basename(file))
            });
        });
    });
})


function transformCollisionLayer(layer){
    collisionPolygons = [];
    layer.objects.forEach(item => {
        let { x, y } = item;
        let polygon = item.polygon.reduce((accumulator, coord) => (
            [...accumulator, parseFloat(x) + parseFloat(coord.x), parseFloat(y) + parseFloat(coord.y)]
        ), []);
        collisionPolygons.push({ coords: polygon });

        });
    return collisionPolygons;
}

function createCollisionPolygons(collisionMatrix){
    var mapWidth = collisionMatrix[0].length;
    var mapHeight = collisionMatrix.length;
    var tileSize = 32;
    let cache = [];
    let foundOne = false;
    var polygons = [];
    
    //search horizontally
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            //debugger;
            if (collisionMatrix[y][x] === 1) {
                if (foundOne === false) foundOne = true;
                cache.push(x);
            } else {
                //found (map[x][y] == 0) and we have a sequence
                // [0,0,10,10,20,0,30,30,0,0]
                if (cache.length > 1 && foundOne === true) {

                    let px1 = cache[0] * tileSize
                    let py1 = y * tileSize

                    let px2 = (cache[cache.length - 1]+1) * tileSize;
                    let py2 = y * tileSize

                    let px3 = (cache[cache.length - 1]+1) * tileSize;
                    let py3 = (y + 1) * tileSize

                    let px4 = cache[0] * tileSize
                    let py4 = (y + 1) * tileSize

                    polygons.push({coords:[px1, py1, px2, py2, px3, py3, px4, py4]});
                    foundOne = false;
                    cache = [];
                } else {
                    //ignore single square
                    foundOne = false;
                    cache = [];
                }
            }
            if (x === mapWidth - 1) {
                if (cache.length > 1 && foundOne === true) {

                    let px1 = cache[0] * tileSize
                    let py1 = y * tileSize

                    let px2 = cache[cache.length - 1] * tileSize;
                    let py2 = y * tileSize

                    let px3 = cache[cache.length - 1] * tileSize;
                    let py3 = (y + 1) * tileSize

                    let px4 = cache[0] * tileSize
                    let py4 = (y + 1) * tileSize

                    polygons.push({coords:[px1, py1, px2, py2, px3, py3, px4, py4]});
                    foundOne = false;
                    cache = [];
                } else {
                    //ignore single square
                    foundOne = false;
                    cache = [];
                }
            }
        }
    }
    cache = [];
    //search vertically
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            //debugger;
            if (collisionMatrix[y][x] === 1) {
                if (foundOne === false) foundOne = true;
                cache.push(y);
            } else {
                //found (map[x][y] == 0) and we have a sequence
                // [0,0,10,10,20,0,30,30,0,0]
                if (cache.length > 1 && foundOne === true) {

                    let px1 = x * tileSize
                    let py1 = cache[0] * tileSize

                    let px2 = (x+1) * tileSize;
                    let py2 = cache[0] * tileSize;

                    let px3 = (x+1) * tileSize;
                    let py3 = (cache[cache.length - 1]+1) * tileSize

                    let px4 = x * tileSize;
                    let py4 = (cache[cache.length - 1]+1) * tileSize;

                    polygons.push({coords:[px1, py1, px2, py2, px3, py3, px4, py4]});
                    foundOne = false;
                    cache = [];
                } else {
                    //ignore single square
                    foundOne = false;
                    cache = [];
                }
            }
            if (y === mapHeight - 1) {
                if ((cache.length > 1 && foundOne === true) /*|| (y + 1 === mapHeight)*/) {
                    let px1 = x * tileSize
                    let py1 = cache[0] * tileSize

                    let px2 = (x+1) * tileSize;
                    let py2 = cache[0] * tileSize;

                    let px3 = (x+1) * tileSize;
                    let py3 = cache[cache.length - 1] * tileSize

                    let px4 = x * tileSize;
                    let py4 = cache[cache.length - 1] * tileSize;

                    polygons.push({coords:[px1, py1, px2, py2, px3, py3, px4, py4]});
                    foundOne = false;
                    cache = [];
                } else {
                    foundOne = false;
                    cache = [];
                }
            }
        }
    }

    //search single units
    for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
            if (y > 0 && x > 0 && y < mapHeight && x < mapWidth) {
                if (collisionMatrix[y][x] === 1 &&
                    collisionMatrix[y - 1][x] === 0 &&
                    collisionMatrix[y + 1][x] === 0 &&
                    collisionMatrix[y][x - 1] === 0 &&
                    collisionMatrix[y][x + 1] === 0) {
                    //polygons.push([x * tileSize, y * tileSize, tileSize, tileSize]);
                    let px1 = x * tileSize;
                    let py1 = y * tileSize;

                    let px2 = (x+1) * tileSize;
                    let py2 = y * tileSize;

                    let px3 = (x+1) * tileSize;
                    let py3 = (y+1) * tileSize;

                    let px4 = x * tileSize;
                    let py4 = (y+1) * tileSize;

                    polygons.push({coords:[px1, py1, px2, py2, px3, py3, px4, py4]});
                }
            }
        }
    }
    return polygons;
}
