import Tool from './tool';
import memoizee from 'memoizee';
import Sound from '@/stages/game/scripts/core/sound';


export default class ToolTarget extends Tool {
    /**
     * 
     * @param {*} id 
     * @param {SceneryManager} sceneryManager 
     */
    constructor(id,quantity ,sceneryManager){
        super(id,quantity, sceneryManager);
        this.getDestructibleObject = memoizee(() => {
            return this.getRegisteredItems({ locked: true })
        });
        this.eventsHandler.subscribe(Tool.EVENTS.HOTBAR_POINTER_CLICK, () => {
            if (this.isEnoughAmountTool() && this.canBeUsed()) {
                this.use();  
            }
        });
    }

    use() {
       
        var lastPos = this.getPlayer().gamePosition;
        var firstBlocked = null;
        var effectArea = firstBlocked ? firstBlocked : lastPos;
        effectArea.z = effectArea.z ? effectArea.z : this.getPlayerPosition().z;

        let event = null;
        let waitToFire = 0; //in milliseconds

        switch(this.item.name){
            case 'lockpick':
                event = Tool.EFFECTS.LOCKPICKING;
                let lockpicksound = new Sound("lockpick", { volume: 1 });
                lockpicksound.play();
                break;

            case 'laserpen':
                event = Tool.EFFECTS.LASER_TARGET;
                let laserpensound = new Sound("laserpen", { volume: 1 });
                laserpensound.play();
                waitToFire = 1200;
                break;

            case 'dynamite':
                event = Tool.EFFECTS.EXPLODE_TARGET;
                // let dynamitesound = new Sound("dynamite", { volume: 1 });
                // dynamitesound.play();
                //waitToFire = 1000;
                break;

            case 'codebreaker':
                event = Tool.EFFECTS.UNLOCK_BY_CODEBREAKER;
                let codebreakersound = new Sound("codebreaker", { volume: 1 });
                codebreakersound.play();
                //waitToFire = 1000;
                break;
            default:
        }

        setTimeout(()=>{
            this.fireEffect(event, {
                affectedPos: effectArea,
                item: this.item,
                done: ()=>this.decrementQuantityTool()
            });
        }, waitToFire);

    }

}