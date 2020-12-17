import EventsHandler from '../../scripts/utils/eventsHandler';
import baseScript from '@/stages/game/scripts/events/scripts/base';
import { Dispatchers as DispatchersGame } from '@/store/ducks/gameplay';

const PIXI = require("pixi.js"),
    { Container } = PIXI;

const styleText = new PIXI.TextStyle({
    fill: '#ffffff',
    fontWeight: "bolder",
    fontSize: 12,
    fontFamily: "MarketDeco"
});


export default class Tool extends baseScript {

    static EFFECTS = {
        THROWABLE_COLLISION: "THROWABLE_COLLISION",
        DRAW_ATTENTION_DANGER: "DRAW_ATTENTION_DANGER",
        LOCKPICKING: "LOCKPICKING",
        LASER_TARGET: "LASER_TARGET",
        BLOCK_SIGNAL: "BLOCK_SIGNAL",
        EXPLODE_TARGET: "EXPLODE_TARGET",
        UNLOCK_BY_CODEBREAKER: "UNLOCK_BY_CODEBREAKER",
        USE_FAKE_ID: "USE_FAKE_ID"
    }

    static EVENTS = {
        HOTBAR_POINTER_CLICK:"HOTBAR_POINTER_CLICK",
        HOTBAR_POINTER_DOWN:"HOTBAR_POINTER_DOWN",
        HOTBAR_POINTER_UP:"HOTBAR_POINTER_UP",
        HOTBAR_POINTER_MOVE:"HOTBAR_POINTER_MOVE",
        HOTBAR_POINTER_OUT:"HOTBAR_POINTER_OUT",
        REMOVE_TOOL: "REMOVE_TOOL"
    }
    /**
     * 
     * @param {*} id 
     * @param {SceneryManager} sceneryManager 
     */
    constructor(item,quantity, sceneryManager){
        super(sceneryManager);
        this.item = item;
        this.quantity = quantity;
        this.sceneryManager = sceneryManager;
        this.eventsHandler = new EventsHandler("TOOL",this);
        this.hotbarContainer = undefined;
        this.toolType = this.item.toolType;
        this._textQuantity = new PIXI.Text(this.quantity, styleText);
        this._textQuantity.anchor.set(0.5,0);
    }


    hasEffect(effect){
        const { throwableOptions } = this.item;
        if (throwableOptions) {
            return throwableOptions.effects.includes(effect);
        }
        return false;
    }

    fireEffect(effect,extraData){
        return this.eventsHandler.fire(effect,extraData);
    }

    isEnoughAmountTool() {
        return this.quantity > 0;
    }

    canBeUsed() {
        var response = false;
        
        var player = this.sceneryManager.worldInstance.player;
        let doors = this.sceneryManager.getAllItemsByAttributes({ obstacle: "door" });
        doors.forEach(door => {
            let x = door.gamePosition.x;
            let y = door.gamePosition.y;
            var distance = this.getDistance(player.gamePosition.x, player.gamePosition.y, x, y);
            if(distance === 1){
                response = true;
            }
        });

        if(response === false){
            player.addBaloon(2000, "forbidden", this.item.texture);
        }
        
        return response;
    }

    getDistance(xA, yA, xB, yB) {
        var xDiff = xA - xB;
        var yDiff = yA - yB;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }

    decrementQuantityTool() {
        DispatchersGame.decreaseInventory(this.item.id);
        
        if (this.quantity > 0) {
            this.quantity -= 1;
        }


        if (this.quantity === 0) {
            this.hotbarContainer.destroy();
            this.hotbarContainer = undefined;
            this.sceneryManagerInstance.worldInstance.refreshTools(false)
        }

        this._updateTextQuantityItems();

    }

    _updateTextQuantityItems() {
        this._textQuantity.text = this.quantity;
    }

    getHotbarContainer(){
        if (this.hotbarContainer) return this.hotbarContainer;
        var textures = PIXI.Loader.shared.resources["gameplay/textures.json"].spritesheet.textures;
        var containerFrame = new Container();
        
        //toolsHolder.png
        var textureIcon = this.item.stackable === true ? "maps/Shared Elements/tools_quantity.png" : "maps/Shared Elements/toolsHolder.png"

        var frame = new PIXI.Sprite(textures[textureIcon]);
        frame.zIndex = 1;
        //frame.scale.set(0.4);
        containerFrame.zIndex = 0;

        containerFrame.addChild(frame);
        
        var hotbarIcon = new PIXI.Sprite(textures[this.item.texture]);
        hotbarIcon.zIndex = 0;
        hotbarIcon.anchor.set(0.5);
        hotbarIcon.scale.set(0.4);
        hotbarIcon.position.set(frame.width/2, frame.height /2);
        containerFrame.addChild(hotbarIcon);

        var containerText = new Container();
        
        containerText.renderable = this.item.stackable === true;
        containerText.addChild(this._textQuantity);
        containerText.x = 60;
        containerText.zIndex = 10;
        containerText.y = 60;
        containerFrame.addChild(containerText);

        containerFrame.interactive=true;
        containerFrame.on('pointertap', (e,ee)=>{
            this.eventsHandler.fire(Tool.EVENTS.HOTBAR_POINTER_CLICK);
           // e.stopPropagation();
        });
        containerFrame.on('pointerdown', (e,ee)=>{
            this.hotbarPointerdown = true;
            this.eventsHandler.fire(Tool.EVENTS.HOTBAR_POINTER_DOWN);
         //   e.stopPropagation();
            
        });
        containerFrame.on('pointermove', (e)=>{
            if (this.hotbarPointerdown === true){
                this.eventsHandler.fire(Tool.EVENTS.HOTBAR_POINTER_MOVE);
              //  e.stopPropagation();
            }
        });
        containerFrame.on('pointerupoutside', (e)=>{
            if (this.hotbarPointerdown === true){
                this.hotbarPointerdown = false;
                this.eventsHandler.fire(Tool.EVENTS.HOTBAR_POINTER_OUT);
              //  e.stopPropagation();
            }
        });
        containerFrame.on('pointerup', (e)=>{
            if (this.hotbarPointerdown === true){
                this.hotbarPointerdown = false;
                this.eventsHandler.fire(Tool.EVENTS.HOTBAR_POINTER_UP);
              //  e.stopPropagation();
            }
        });
        this.hotbarContainer = containerFrame;
        return this.hotbarContainer;
    }

}