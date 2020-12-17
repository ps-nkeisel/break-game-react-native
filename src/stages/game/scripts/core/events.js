import listeners from '../events/index'
import EventsHandler from '../utils/eventsHandler';
import _ from 'lodash'

export default class Event {

    constructor(sceneryManager) {
        this.sceneryManager = sceneryManager;
        this.scriptInstances = [];
        this.listeners = [];
    }

    getScriptIntance(sampleInstance,context) {

        var searchInstance = this.scriptInstances.filter((v) => {
            return v instanceof sampleInstance && context.uid === v.context.uid
        });
        searchInstance = searchInstance.length > 0 ? searchInstance[0] : false

        if (!searchInstance) {
            var instance = new sampleInstance(this.sceneryManager);
            instance.context = context;
            this.scriptInstances.push(instance);
            return instance;
        } else {
            return searchInstance;
        }
    }

    register() {

        listeners.forEach(evt => {
            evt.events.forEach(event_type => {
                this.listeners.push(EventsHandler.subscribe(event_type, (data, event_type, entity, context) => {
                    if (this._checkConditions(evt.conditions, context)) {
                        let instanceScript = this.getScriptIntance(evt.script,context);
                        instanceScript[_.camelCase(event_type)](data, event_type, entity, context);
                    }
                }));
            });
        });
    }

    unregister(){
        this.listeners.forEach(fn => {
            EventsHandler.unsubscribe(fn);
        });
    }

    _checkConditions(conditions, context) {
        if (!conditions) return true;

        if (conditions.isPlayer && !context.isPlayer) return false;

        if (conditions.onlyScenaryId && this.sceneryManager.sceneryId !== conditions.onlyScenaryId) return false;

        return true;
    }


}