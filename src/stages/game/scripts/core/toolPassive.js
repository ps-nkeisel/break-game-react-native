//import GameService from './services/GameService';
import Tool from './tool'
//import memoizee from 'memoizee';
//import { ease } from 'pixi-ease';
//import { transformGamePositionToCoord, getPosByDirection } from '../utils/matrix'
//import Sound from '@/stages/game/scripts/core/sound';

const PIXI = require("pixi.js");



export default class ToolPassive extends Tool {
    /**
     * 
     * @param {*} id 
     * @param {SceneryManager} sceneryManager 
     */
    constructor(id,quantity, sceneryManager) {
        super(id,quantity, sceneryManager);
        // this.getDestructibleObject = memoizee(() => {
        //     return this.getRegisteredItems({ obstacle: "flagile_glass" }, false)
        // });
        // this.projectileContainer = new PIXI.Container();
        // this.sceneryManagerInstance.upperSceneryContainer.addChild(this.projectileContainer);
        this.eventsHandler.subscribe(Tool.EVENTS.HOTBAR_POINTER_CLICK, () => {
            //if (this.isEnoughAmountTool()) {
                this.use();
            //}     
        });

        this.canBeUsed = true;
    }

    use() {
        if(this.item.name === "signalblocker" && this.canBeUsed === true){
            //console.log("Usando...");
            this.fireEffect(Tool.EFFECTS.BLOCK_SIGNAL, {vazio: true}, this.item);
            this.setTimerToReuse();
        } else if(this.item.name === "fakeid" && this.canBeUsed === true){
            //console.log("Usando...");
            this.fireEffect(Tool.EFFECTS.USE_FAKE_ID, {vazio: true}, this.item);
            this.setTimerToReuse(()=>{
                this.decrementQuantityTool();
            });
        }
    }

    setTimerToReuse(callback){
        /*
        this.hotbarContainer.alpha = 0.5;
        this.canBeUsed = false;
        this.timerInterval = setInterval(()=>{
            this.hotbarContainer.alpha += 0.005;
            if(this.hotbarContainer.alpha >= 1.0){
                clearInterval(this.timerInterval);
                this.timerInterval = null;
                this.canBeUsed = true;
            } 
            console.log("Chegou aqui!");
        }, 50);
        */

        this.canBeUsed = false;

        this.hotbarContainer.alpha = 0.7;
        this.hotbarContainer.tint = 0xa4a4a4;
        this.hotbarContainer.children[1].tint = 0xa4a4a4;

        if(this.mask === undefined){
            this.mask = new PIXI.Graphics();
            this.mask.position.set(this.hotbarContainer.children[1].x, this.hotbarContainer.children[1].y);
            this.hotbarContainer.children[1].mask = this.mask;
            window.mask = this.mask;
            this.hotbarContainer.addChild(this.mask); 
        }
        this.maskPhase = 0;
        let delta = 6;
        this.timerInterval = setInterval(()=>{
            // Update phase
            this.maskPhase += delta / 60;
            this.maskPhase %= (Math.PI * 2);

            if(this.maskPhase >= 6.1){
                this.maskPhase = 6.5;
            }

            const angleStart = 0 - Math.PI / 2;
            const angle = this.maskPhase + angleStart;
            const radius = 50;

            const x1 = Math.cos(angleStart) * radius;
            const y1 = Math.sin(angleStart) * radius;

            // Redraw mask
            this.mask.clear();
            this.mask.lineStyle(2, 0xff0000, 1);
            this.mask.beginFill(0xff0000, 1);
            this.mask.moveTo(0, 0);
            this.mask.lineTo(x1, y1);
            this.mask.arc(0, 0, radius, angleStart, angle, false);
            this.mask.lineTo(0, 0);
            this.mask.endFill();

            //console.log("maskPhase: "+this.maskPhase);
            if(this.maskPhase >= 6.1){
                clearInterval(this.timerInterval);
                this.canBeUsed = true;
                this.hotbarContainer.alpha = 1.0;
                this.hotbarContainer.tint = 0xFFFFFF;
                this.hotbarContainer.children[1].tint = 0xFFFFFF;

                if(typeof callback === "function") callback();
            }
        }, 100);
    }

}
