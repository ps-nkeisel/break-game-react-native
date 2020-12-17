import Store from '@/store';

export const Types = {
  CHANGE_OPTION_MUTED_SOUND: 'app/CHANGE_OPTION_MUTED_SOUND'
};


const initialState = {
  muted: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.CHANGE_OPTION_MUTED_SOUND:
      return { ...state, muted: action.payload.muted };
    default:
      return state;
  }
}

export const Dispatchers = {
  changeStatsMute: (newValue) => Store.dispatch({
    type: Types.CHANGE_OPTION_MUTED_SOUND,
    payload: {
      muted: newValue,
    },
  })
};
