import Store from '@/store';


const PIXI = require("pixi.js"),
    { Container } = PIXI;


export default class Tool extends Container {


    constructor(inventory) {
        this.inventory = inventory;
    }


    render() {
        if (this.inGaming) {
            var { inventory } = Store.getState().user;
            DispatchersGame.setInventory(inventory);
            var { inventory } = Store.getState().gameplay;

            this.player.initBonus();

            var backpack = gameService.getCurrentPlayerBackpack();
            DispatchersGame.setBackpackCapacity(backpack.capacity);

            this.toolsContainer.removeChildren();
            inventory.forEach((tool, i) => {
                if (tool.quantity <= 0) return true;
                var _ToolFactory = new ToolFactory(this.sceneryManager);
                var tool = _ToolFactory.makeTool(tool.id, tool.quantity);
                var item = tool.getHotbarContainer();
                if (i > 0) {
                    item.position.set(75 * i, 0);
                }
                this.toolsContainer.addChild(item);
            });
            this.toolsContainer.position.set(window.innerWidth / 2, window.innerHeight - 120);
            this.toolsContainer.pivot.set(this.toolsContainer.width / 2, this.toolsContainer.height / 2);
            this.player.refreshAccessories()
        }
    }

}