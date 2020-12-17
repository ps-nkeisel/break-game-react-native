import Tool from './tool'
import memoizee from 'memoizee';
import { ease } from 'pixi-ease';
import { getPosByDirection } from '../utils/matrix'
import Sound from '@/stages/game/scripts/core/sound';

const PIXI = require("pixi.js");


export default class ToolThrowable extends Tool {

    projectile = null;

    /**
     * 
     * @param {*} id 
     * @param {SceneryManager} sceneryManager 
     */
    constructor(id, quantity, sceneryManager) {
        super(id, quantity, sceneryManager);
        this.getDestructibleObject = memoizee(() => {
            return this.getRegisteredItems({ obstacle: "flagile_glass" })
        });
        this.projectileContainer = new PIXI.Container();
        this.sceneryManagerInstance.upperSceneryContainer.addChild(this.projectileContainer);
        this.eventsHandler.subscribe(Tool.EVENTS.HOTBAR_POINTER_CLICK, () => {
            if (this.isEnoughAmountTool()) {
                this.throw();
            }
        });

    }

    // checkGlassCollision(x, y, z) {
    //     let glasses = this.getDestructibleObject();
    //     for (let i = 0; i < glasses.length; i++) {
    //         const glass = glasses[i];
    //         if (glass.gamePosition.x === x && y === glass.gamePosition.y && z === glass.gamePosition.z)
    //             return glass;
    //     }
    //     return false;
    // }

    throw() {
        let projectile = this.makeProjectile();
        this.projectileContainer.addChild(projectile);

        var currentPos = this.getPlayer().getDirection().split("-");
        var distance = 5;
        var lastPos = this.getPlayer().gamePosition

        var whoosh = new Sound("whoosh", { volume: 1 });
        whoosh.play();

        var firstBlocked = null;

        for (let i = 0; i < distance; i++) {
            var pos = getPosByDirection(lastPos, currentPos[0], currentPos[1]);

            if (this.sceneryManagerInstance.isPositionWalkable(pos.x, pos.y, this.getPlayer().gamePosition.z)) {
                lastPos = pos
            } else
                if (!firstBlocked)
                    firstBlocked = pos
        }
        var effectArea = firstBlocked ? firstBlocked : lastPos;
        effectArea.z = effectArea.z ? effectArea.z : this.getPlayerPosition().z;


        var playerPos = this.getPlayerWorldPosition();
        var baseScale = projectile.baseScale;

        projectile.position.set(playerPos.x, playerPos.y);
        projectile.rotation = 0;
        projectile.alpha = 1;
        projectile.scale.set(projectile.baseScale);
        var timeout = 1000;

        ease.add(projectile, { position: { x: effectArea.x * 32 + 16, y: effectArea.y * 32 + 16 } }, { duration: timeout })

        // posAnim.once("complete", () => {
        //     ease.add(projectile, { alpha: 0 }, { wait: 300, duration: 2000 })
        // });

        ease.add(projectile, { rotation: (1 + Math.random() * 10) * (Math.random() >= 0.5 ? 1 : -1) }, { duration: timeout });

        setTimeout(() => {
            this.fireEffect(Tool.EFFECTS.THROWABLE_COLLISION, {
                affectedPos: effectArea,
                item: this.item,
                sprite: this,
                destroy: (callback) => {
                    this.fadeOut(callback, projectile)
                }
            });
        }, timeout);


        var a = ease.add(projectile, { scale: baseScale + 0.11 }, { duration: timeout / 2 })
        a.once("complete", () => {
            ease.add(projectile, { scale: baseScale }, { duration: timeout / 2 });
        });

        this.decrementQuantityTool();
    }

    fadeOut(callback, projectile) {
        let animation = ease.add(projectile, { alpha: 0 }, { wait: 300, duration: 2000 });
        animation.once("complete", () => {
            //ease.add(this.projectile, { alpha: 0 }, { wait: 300, duration: 2000 })
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    makeProjectile() {
        var textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
        var projectile = new PIXI.Sprite(textures[this.item.texture]);
        projectile.anchor.set(0.5);
        projectile.scale.set(0.1);
        projectile.baseScale = 0.1;
        projectile.alpha = 1;
        return projectile;
    }

}
