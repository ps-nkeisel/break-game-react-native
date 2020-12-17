import ObjectItem from './object';
import _ from 'underscore';

const PIXI = require("pixi.js");

export default class Item extends ObjectItem {

    constructor(texture, extraData, fliped) {
        super();
        this.pivot.set(16, 16);
        this.isCoins = false;
        try {
            if (extraData.properties.coins) {
                this.isCoins = true
            }
        } catch (error) {

        }

        this.itemContainer = new PIXI.Container();
        this.addChild(this.itemContainer);

        this.typeObject = 'item';
        this._texture = texture;
        this.extraData = extraData;
        this.tiledId = extraData.gid;
        this.fliped = fliped;
        this.init();
    }

    init() {
        const { isHorizontalFliped, isVerticalFliped, isDiagonalFliped } = this.fliped;
        this.sprite = new PIXI.Sprite(this._texture);

        if (isHorizontalFliped) {
            this.sprite.anchor.x = 1;
            this.sprite.scale.x = -1;
        }

        if (isVerticalFliped) {
            this.sprite.anchor.y = 1;
            this.sprite.scale.y = -1;
        }

        if (isDiagonalFliped) {
            this.sprite.pivot.x = this.sprite.height - 32;
            this.sprite.pivot.y = this.sprite.width - 32;



            if (!isVerticalFliped && !isHorizontalFliped) {
                this.sprite.anchor.x = 0;
                this.sprite.anchor.y = 0;
                this.sprite.scale.x = -1;
                this.sprite.scale.y = 1;
                this.sprite.rotation = PIXI.DEG_TO_RAD * -90;

            } else if (isVerticalFliped && isHorizontalFliped) {
                this.sprite.anchor.x = 1;
                this.sprite.anchor.y = 1;
                this.sprite.scale.x = 1;
                this.sprite.scale.y = -1;
                this.sprite.rotation = PIXI.DEG_TO_RAD * -90;

            } else if (isVerticalFliped) {
                this.sprite.anchor.x = 1;
                this.sprite.anchor.y = 0;
                this.sprite.scale.x = 1;
                this.sprite.scale.y = 1;
                this.sprite.rotation = PIXI.DEG_TO_RAD * -90;
            } else if (isHorizontalFliped) {
                this.sprite.anchor.x = 0;
                this.sprite.anchor.y = 1;
                this.sprite.scale.x = 1;
                this.sprite.scale.y = 1;
                this.sprite.rotation = PIXI.DEG_TO_RAD * 90;
            }

        }
 

        this.itemContainer.removeChildren();


        this.itemContainer.addChild(this.sprite);
        
        

    }

    getCollisionShape() {
        var positions = {
            left: [[false, true, true], [false, false, true]],
            right: [[true, false, true], [true, true, true]],
            top: [[false, false, false], [true, false, false]],
            bottom: [[true, true, false], [false, true, false]]
        }
        let flipedIdentity = [this.fliped.isHorizontalFliped, this.fliped.isVerticalFliped, this.fliped.isDiagonalFliped]
        var foundPosition = null;
        _.mapObject(positions, function (arr, position) {
            if (foundPosition !== null) return true;
            arr.forEach(identity => {
                var wrong = false;
                for (let i = 0; i < 3; i++) {
                    if (identity[i] !== flipedIdentity[i]) {
                        wrong = true;
                        break;
                    }
                }
                if (wrong === false) {
                    foundPosition = "" + position;
                }
            });
            return arr;
        });

        let trimRect = this.sprite?.texture?.trim;
        if (!trimRect)
            return null;

        switch (foundPosition) {
            case "left":
                return this.transformRectToCoords(0, 0, trimRect.height, trimRect.width);
            case "right":
                return this.transformRectToCoords(32 - trimRect.height, 0, 32, trimRect.width);
            case "top":
                return this.transformRectToCoords(0, 0, trimRect.width, trimRect.height );
            case "bottom":
                return this.transformRectToCoords(0, 32 - trimRect.height, trimRect.width, 32 );
            default:
                return null;
        }
    }

    transformRectToCoords(ax,ay,bx,by){
        const {x, y} = this.gamePosition;

        if (x === 29 && y === 28) debugger;
    

        const boxX = (32 * x);
        const boxY = (32 * y);


        let collisionBox = [];
        collisionBox.push(boxX + ax, boxY + ay); // Pontos principais
        collisionBox.push(boxX + bx ,boxY + ay);
        collisionBox.push(boxX + bx, boxY + by); // Pontos principais
        collisionBox.push(boxX + ax ,boxY + by);

        return collisionBox;
    }
}