import Tool from './tool'
//import Sound from '@/stages/game/scripts/core/sound';

const PIXI = require("pixi.js");



export default class ToolSelf extends Tool {
    /**
     * 
     * @param {*} id 
     * @param {SceneryManager} sceneryManager 
     */
    constructor(id, quantity, sceneryManager) {
        super(id, quantity, sceneryManager);

        this.eventsHandler.subscribe(Tool.EVENTS.HOTBAR_POINTER_CLICK, () => {
            //if (this.isEnoughAmountTool()) {
            this.use();
            //}     
        });

        this.canBeUsed = true;
    }

    use() {
        if (this.item.name === "stimpack" && this.canBeUsed === true) {
            var player = this.getPlayer();
            player.speed = player.baseSpeed * 0.5;

            this.setTimerToStopEffect(() => {
                this.decrementQuantityTool();
                player.speed = player.speed * 2;
            });
        }
    }

    setTimerToStopEffect(onEffectStopped) {
        this.canBeUsed = false;

        this.hotbarContainer.alpha = 0.7;
        this.hotbarContainer.tint = 0xa4a4a4;
        this.hotbarContainer.children[1].tint = 0xa4a4a4;

        if (this.mask === undefined) {
            this.mask = new PIXI.Graphics();
            this.mask.position.set(this.hotbarContainer.children[1].x, this.hotbarContainer.children[1].y);
            this.hotbarContainer.children[1].mask = this.mask;
            window.mask = this.mask;
            this.hotbarContainer.addChild(this.mask);
        }
        this.maskPhase = 0;
        let delta = 6;
        this.timerInterval = setInterval(() => {
            // Update phase
            this.maskPhase += delta / 60;
            this.maskPhase %= (Math.PI * 2);

            if (this.maskPhase >= 6.1) {
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
            if (this.maskPhase >= 6.1) {
                clearInterval(this.timerInterval);
                this.canBeUsed = true;
                this.hotbarContainer.alpha = 1.0;
                this.hotbarContainer.tint = 0xFFFFFF;
                this.hotbarContainer.children[1].tint = 0xFFFFFF;

                if (typeof onEffectStopped === "function") {
                    onEffectStopped();
                }

            }
        }, 100);
    }

}
