import Store from '../index';
import _ from 'underscore';

export const Types = {
  SET_USER_INFO: 'USER/SET_USER_INFO',
  INCREMENT_ITEM_BACKPACK: 'USER/INCREMENT_ITEM_BACKPACK',
  ADD_USER_COINS: 'USER/ADD_USER_COINS',
  ADD_USER_EXPERIENCE: 'USER/ADD_USER_EXPERIENCE',
  SET_USER_LEVEL: "USER/SET_USER_LEVEL",
  ADD_SCENERY_COMPLETED: "USER/ADD_SCENERY_COMPLETED",
  ADD_SCENERY_PLAYED: "USER/ADD_SCENERY_PLAYED",
  SET_INVENTORY: "USER/SET_INVENTORY",
  SET_USER_BACKPACK: "USER/SET_USER_BACKPACK",
  SET_USER_HAT: "USER/SET_USER_HAT",
  SET_USER_ESCAPE_CAR: "USER/SET_USER_ESCAPE_CAR",
  SET_USER_TUTORIAL_UPGRADES_DONE: "USER/SET_USER_TUTORIAL_UPGRADES_DONE",
  ADD_INVENTORY: "USER/ADD_INVENTORY",
  ADD_DAYSTREAK: "USER/ADD_DAYSTREAK",
  CLEAR_DAYSTREAK: "USER/CLEAR_DAYSTREAK",
  SET_APITOKEN: "USER/SET_APITOKEN",
  ADD_REWARDED_BAILOUT: "USER/ADD_REWARDED_BAILOUT",
  INCREMENT_PLAYED_TIMES:"INCREMENT_PLAYED_TIMES"
};

const initialState = {
  token: null,
  level: 1,
  timesPlayed: 1,
  experience: 0,
  coins: 0,
  name: '',
  playerId: '',
  avatar: null,
  battlePass: 2,
  backpackId: 1,
  hatId: 12,
  escapeCarId: 26,
  tutorialUpgradesDone: false,
  sceneriesCompleted: [],
  sceneriesPlayed: [],
  inventory: [],
  daystreak: [],
  rewardedBailout: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.SET_USER_INFO:
      return { ...state, ...action.payload };
    case Types.SET_USER_LEVEL:
      return { ...state, level: action.payload.level };
    case Types.ADD_USER_COINS:
      var newValue = parseInt(state.coins) + parseInt(action.payload.amount);
      return { ...state, coins: newValue };
    case Types.ADD_USER_EXPERIENCE:
      var newExperienceValue = parseInt(state.experience) + parseInt(action.payload.amount);
      return { ...state, experience: newExperienceValue };
    case Types.INCREMENT_PLAYED_TIMES:
      return {...state, timesPlayed: state.timesPlayed + 1};

    case Types.ADD_INVENTORY:
      let id = action.payload.id;
      let quantity = action.payload.quantity;

      let found = _.findWhere(state.inventory, { id: id });

      let newInventory = state.inventory;
      if (found) {
        newInventory = state.inventory.map((item) => {
          if (item.id === id) {
            item.quantity = Number.isInteger(item.quantity) ? item.quantity + quantity : quantity;
          }
          return item;
        });
      } else {
        newInventory.push({ id: id, quantity: quantity });
      }
      return { ...state, inventory: newInventory }

    case Types.SET_INVENTORY:
      return { ...state, inventory: action.payload.newValue }

    case Types.SET_USER_BACKPACK:
      return { ...state, backpackId: action.payload.backpackId }

    case Types.SET_USER_HAT:
      return { ...state, hatId: action.payload.hatId }

    case Types.SET_USER_ESCAPE_CAR:
      return { ...state, escapeCarId: action.payload.escapeCarId }

    case Types.SET_USER_TUTORIAL_UPGRADES_DONE:
      return { ...state, tutorialUpgradesDone: action.payload.tutorialUpgradesDone }

    case Types.ADD_SCENERY_COMPLETED:
      function upsert(array, item) { // (1)
        const i = array.findIndex(_item => _item.id === item.id);
        if (i > -1) array[i] = { ...item, times: array[i].times + 1 }; // (2)
        else array.push({ ...item, times: 1 });
      }
      upsert(state.sceneriesCompleted, action.payload);
      return { ...state, sceneriesCompleted: state.sceneriesCompleted };

    case Types.ADD_SCENERY_PLAYED:
      upsert(state.sceneriesPlayed, action.payload);
      return { ...state, sceneriesPlayed: state.sceneriesPlayed };
    case Types.SET_APITOKEN: 
      return {...state, token: action.payload.token }
    case Types.ADD_DAYSTREAK:
      let date = action.payload.date;
      let datetime = action.payload.datetime;
      let timestamp = action.payload.timestamp;

      let foundDay = _.findWhere(state.daystreak, { date: date });
      let newDaystreak = state.daystreak;
      if (foundDay) {
        console.log("DAYSTREAK REPETIDO!");
      } else {
        newDaystreak.push({ date: date, datetime: datetime, timestamp: timestamp });
      }
      return { ...state, daystreak: newDaystreak }

    case Types.CLEAR_DAYSTREAK:
      return { ...state, daystreak: [] }
    
    case Types.ADD_REWARDED_BAILOUT:
        return {...state, rewardedBailout: [...state.rewardedBailout, action.payload.uniqId]}

    default:
      return state;
  }
}

export const Dispatchers = {
  setUserInfo: (token, avatar, name, playerId) => Store.dispatch({
    type: Types.SET_USER_INFO,
    payload: {
      token,
      avatar,
      name,
      playerId
    },
  }),
  incrementPlayedTimes: () => Store.dispatch({
    type: Types.INCREMENT_PLAYED_TIMES
  }),
  addUserCoins: (amount) => Store.dispatch({
    type: Types.ADD_USER_COINS,
    payload: {
      amount
    },
  }),
  addUserExperience: (amount) => Store.dispatch({
    type: Types.ADD_USER_EXPERIENCE,
    payload: {
      amount
    },
  }),
  addSceneryCompleted: (id, stars) => Store.dispatch({
    type: Types.ADD_SCENERY_COMPLETED,
    payload: {
      id, stars
    },
  }),
  addSceneryPlayed: (id) => Store.dispatch({
    type: Types.ADD_SCENERY_PLAYED,
    payload: {
      id
    },
  }),
  setUserLevel: (newLevel) => Store.dispatch({
    type: Types.SET_USER_LEVEL,
    payload: {
      level: newLevel
    },
  }),
  setUserBackpack: (newBackpackId) => Store.dispatch({
    type: Types.SET_USER_BACKPACK,
    payload: {
      backpackId: newBackpackId
    },
  }),
  setUserHat: (newHatId) => Store.dispatch({
    type: Types.SET_USER_HAT,
    payload: {
      hatId: newHatId
    },
  }),
  setUserEscapeCar: (newEscapeCarId) => Store.dispatch({
    type: Types.SET_USER_ESCAPE_CAR,
    payload: {
      escapeCarId: newEscapeCarId
    },
  }),
  setUserTutorialUpgradesDone: (done) => Store.dispatch({
    type: Types.SET_USER_TUTORIAL_UPGRADES_DONE,
    payload: {
      tutorialUpgradesDone: done
    },
  }),
  addUserInventory: (id, quantity) => Store.dispatch({
    type: Types.ADD_INVENTORY,
    payload: {
      id: id,
      quantity: quantity
    },
  }),
  setUserInventory: (newValue) => Store.dispatch({
    type: Types.SET_INVENTORY,
    payload: {
      newValue: newValue
    },
  }),
  addUserDayStreak: (date, datetime, timestamp) => Store.dispatch({
    type: Types.ADD_DAYSTREAK,
    payload: {
      date: date,
      datetime: datetime,
      timestamp: timestamp
    },
  }),
  clearUserDayStreak: () => Store.dispatch({
    type: Types.CLEAR_DAYSTREAK,
    payload: {},
  }),

  setApiToken: (token) => Store.dispatch({
    type: Types.SET_APITOKEN,
    payload: {token},
  }),
  
  addRewardBailout: (uniqId) => Store.dispatch({
    type: Types.ADD_REWARDED_BAILOUT,
    payload: {uniqId},
  })

};
