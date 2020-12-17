import Store from '../index';

export const Types = {
  LOAD_SCENERY_REQUEST: 'app/LOAD_SCENERY_REQUEST',
  LOAD_SCENERY_SUCCESS: 'app/LOAD_SCENERY_SUCCESS',
  LOAD_SCENERY_FAILED: 'app/LOAD_SCENERY_FAILED'
};

const initialState = {
  count: null,
  loading: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.LOAD_SCENERY_REQUEST:
      return { ...state, loading: true, count: action.payload.count };
    case Types.LOAD_SCENERY_SUCCESS:
      return { ...state, loading: false, error: false };
    case Types.LOAD_SCENERY_FAILED:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
}

export const Dispatchers = {
  loadMap: (mapName) => Store.dispatch({
    type: Types.LOAD_SCENERY_REQUEST,
    payload: {
      count: mapName,
    },
  })
};
