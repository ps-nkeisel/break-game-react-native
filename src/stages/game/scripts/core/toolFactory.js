import GameService from './services/GameService';
import ToolThrowable from './toolThrowable';
import ToolPassive from './toolPassive';
import ToolTarget from './toolTarget';
import ToolSelf from './toolSelf';


export default class ToolFactory {

    constructor(sceneryManager) {
        this.sceneryManager = sceneryManager;
    }
    /**
     * 
     * @returns {Tool} 
     */
    makeTool(id, quantity) {
        this.id = id;
        this.quantity = quantity;
        this.item = GameService.getItem(id);

        if (!this.item)
            throw new Error("ItemID " + this.id + " wasn't found.");
        /*
        if (this.item.toolType == "throwable") {
            return this._makeToolThrowable();
        } 
        else if (this.item.toolType === "target"){
            return this._makeToolTarget();
        }else if (this.item.toolType === "passive"){
            return this._makeToolPassive();
        }
        else
            throw new Error("Tool ID " + id + " has not a toolType attribute.");
        */
        switch (this.item.toolType) {
            case "throwable":
                return this._makeToolThrowable();
            case "target":
                return this._makeToolTarget();
            case "passive":
                return this._makeToolPassive();
            case "self":
                return this._makeToolSelf();
            default:
                throw new Error("Tool ID " + id + " has not a toolType attribute.");
        }
    }


    _makeToolThrowable(tool) {
        return new ToolThrowable(this.item, this.quantity, this.sceneryManager);
    }

    _makeToolPassive(tool) {
        //console.log("quantity",this.quantity)
        return new ToolPassive(this.item, this.quantity, this.sceneryManager);
    }

    _makeToolTarget(tool) {
        return new ToolTarget(this.item, this.quantity, this.sceneryManager);
    }

    _makeToolSelf(tool) {
        //console.log("quantity",this.quantity)
        return new ToolSelf(this.item, this.quantity, this.sceneryManager);
    }

}