import EventsHandler from '../utils/eventsHandler';
const PIXI = require("pixi.js"),
    {  Container } = PIXI;


export default class ObjectItem extends Container {

    static EVENTS_HANDLERS = {
        ON_SCENERYMANAGER_INSTANCE_RECEIVED: "ON_SCENERY_REGISTERED"
    };

    constructor() {
        super();
        this.gamePosition = { x: 0, y: 0 }
        this.eventsHandler = new EventsHandler("OBJECT",this);
        
        
        let uid = Math.ceil(Math.random() * 100000000000)        
        this.uid = uid;
        this.sceneryManager = null;

        this.walkable = false;

    }

    onRegistered() {
        if (this.extraData) {
            this.walkable = !!this.extraData.properties.walkable;
        }
        this.eventsHandler.fire(ObjectItem.EVENTS_HANDLERS.ON_SCENERYMANAGER_INSTANCE_RECEIVED);
    }
    

    setPosition(x, y,z=0) {
        this.position.set((x * 32) + 16, (y * 32) + 16);
        this.gamePosition = { x, y, z };

        if (!this.originalPos) {
            this.originalPos = { x: this.position.x, y: this.position.y };
        }
        
    }

}