import Store from '../index';

export const Types = {
  INIT_SCENARY: 'gameplay/INIT_SCENERY',
  SET_BACKPACK_CAPACITY: 'gameplay/SET_BACKPACK_CAPACITY',
  SET_INVENTORY: 'gameplay/SET_INVENTORY',
  DECREASE_INVENTORY: 'gameplay/DECREASE_INVENTORY',
  INCREMENT_ITEM_BACKPACK: 'gameplay/INCREMENT_ITEM_BACKPACK',
  SET_GAMEPLAY_TOTAL_LOOTS: 'gameplay/SET_GAMEPLAY_TOTAL_LOOTS'
};


const initialState = {
  scenary_manifest: null,
  mute: true,
  totalLoots: 0,
  backpack: {
    capacity: 0,
    items: [],
    name: 'Backpack',
    avatar: '',
    worthy:0
  },
  stateModal: {
    keyModal: null,
    visibility: false,
  },
  inventory: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.SET_STATE_MODAL:
      return { ...state, stateModal: action.payload.modal };

    case Types.INIT_SCENARY:
      return { ...state, backpack: initialState.backpack, scenary_manifest: action.payload.scenary_manifest };
    case Types.SET_BACKPACK_CAPACITY:
      return {...state, backpack: {...state.backpack, capacity: action.payload.newValue} }
    
    case Types.DECREASE_INVENTORY:
      var newInventory = state.inventory.map((item)=>{
        if (item.id === action.payload.id)
          item.quantity -= 1;
        return item;
      });
      newInventory = newInventory.filter((item)=>(
        item.quantity > 0
      ));
      return {...state,inventory: newInventory};
    case Types.SET_INVENTORY:
      return {...state, inventory: action.payload.newValue}
    case Types.INCREMENT_ITEM_BACKPACK:
      var worthy = state.backpack.worthy; 
      if (action.payload.item.worthy)
        worthy += action.payload.item.worthy;
      return { ...state, backpack: { ...state.backpack,worthy:worthy, items: [...state.backpack.items,action.payload.item] } };
      
    case Types.SET_GAMEPLAY_TOTAL_LOOTS:
      return {...state, totalLoots: action.payload.totalLoots};

    default:
      return state;
  }
}

export const Dispatchers = {
  initScenary: (scenary) => Store.dispatch({
    type: Types.INIT_SCENARY,
    payload: {
      scenary_manifest: scenary,
    },
  }),
  setInventory : (newValue) => Store.dispatch({
    type: Types.SET_INVENTORY,
    payload: {
      newValue: newValue,
    },
  }),
  decreaseInventory: (id, amount) => Store.dispatch({
    type: Types.DECREASE_INVENTORY,
    payload: {
      id: id
    },
  }),
  setBackpackCapacity: (newValue) => Store.dispatch({
    type: Types.SET_BACKPACK_CAPACITY,
    payload: {
      newValue: newValue,
    },
  }),
  setGameplayTotalLoots: (totalLoots) => Store.dispatch({
    type: Types.SET_GAMEPLAY_TOTAL_LOOTS,
    payload: {
      totalLoots: totalLoots,
    },
  }),
  incrementItemBackPack: (item) => Store.dispatch({
    type: Types.INCREMENT_ITEM_BACKPACK,
    payload: {
      item: item
    },
  })
};
