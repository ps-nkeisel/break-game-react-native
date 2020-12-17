import UpdateCollisionMatrix from './scripts/updateCollisionMatrix';
import CreatureMovement from '../core/creatureMovement';
import World from '../core/world';


import Door from './scripts/door';
import Looting from './scripts/looting';
import RescueArea from './scripts/rescueArea'
import YeeziStoreStairs from './scripts/maps/Yeezi_Store/stairs'
import SceneryLoad from './scripts/sceneryLoad'



var listeners = [
    {
        events: [CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_START],
        script: Door
    },
    {
        events: [CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_START],
        script: Looting,
        conditions: {
            isPlayer: true
        }
    },
    {
        events: [CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_START],
        script: RescueArea,
        conditions: {
            isPlayer: true
        }
    },
    {
        events: [CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_FINISHED, CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_START],
        script: UpdateCollisionMatrix
    },
    {
        events: [CreatureMovement.EVENTS_HANDLERS.ON_MOVEMENT_FINISHED],
        script: YeeziStoreStairs
    },
    {
        events: [World.EVENTS_HANDLERS.ON_SCENERY_LOADED],
        script: SceneryLoad
    }
]

export default listeners;