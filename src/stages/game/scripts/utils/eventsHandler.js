export default class Events{
    
    static GLOBAL_HANDLERS = [];

    constructor(name="", context){
        this.handlers = [];
        this.name = name;
        this.context = context;
    }

    getAllHandlers(){
        return this.handlers.concat(Events.GLOBAL_HANDLERS) || []
    }
    static unsubscribeAll(){
        Events.GLOBAL_HANDLERS = [];
    }


    static subscribe(type,fn){
        let types = type;
        if (!Array.isArray(type))
            types = [type];
        types.forEach(type => { 
            Events.GLOBAL_HANDLERS.push({EVENT_TYPE:type,fn});
        });
        return fn;
    }

    static unsubscribe(fn) {
        Events.GLOBAL_HANDLERS = Events.GLOBAL_HANDLERS.filter(
            function(item) {
                if (item.fn !== fn) {
                    return item;
                }else{
                    return null;
                }
            }
        );
    }

    /**
     * Subscribe to a channel of events.
     * @param {string} type Type of event you want to subscribe to.
     * @callback fn
     * @param {*} data Extra data sent by event
     * @param {string} eventType Type of event you've subscribed
     * @param {string} eventGroupName Name of the group of event
     */
    subscribe(type, fn){
        let types = type;
        if (!Array.isArray(type))
            types = [type];
        types.forEach(type => { 
            this.handlers.push({EVENT_TYPE:type,fn});
        });
        return fn;

    }

    

    unsubscribe(fn) {
        this.handlers = this.handlers().filter(
            function(item) {
                if (item.fn !== fn) {
                    return item;
                }else{
                    return null;
                }
            }
        );
    }

    unsubscribeAll() {
        this.handlers = [];
    }

    fire(type, params) {
        var handlers = this.getAllHandlers();
        if (handlers){
            handlers.forEach((item)=> {
                if (item.EVENT_TYPE === type)
                    item.fn.call(this, params,item.EVENT_TYPE,this.name,this.context);
            });
        }
    }

}