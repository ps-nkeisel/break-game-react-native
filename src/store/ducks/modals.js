import Store from '@/store';

export const Types = {
  SET_STATE_MODAL: 'app/SET_STATE_MODAL',
  CHANGE_OPTION_MUTED_SOUND: 'app/CHANGE_OPTION_MUTED_SOUND'
};

export const MODALS_KEY = {
  LOCKED: 'locked_screen',
  DAY_STREAK: 'day_streak_screen',
  TOMORROW_REWARD: 'tomorrow_reward_screen',
  LEVEL_COMPLETED: 'level_completed',
  JAIL: 'jail',
  TUTORIAL_GAME: 'tutorial_game',
  SEASON_REWARDS: 'season_rewards',
  REQUIRED_TOOLS: 'required_tools',
  BAILOUT_POPUP: 'bailoutPopup'
};

const initialState = {
  stateModal: {
    keyModal: null,
    visibility: false,
  },
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case Types.SET_STATE_MODAL:
      return { ...state, stateModal: action.payload.modal };
    default:
      return state;
  }
}

export const Dispatchers = {
  setStateModal: (modal) => Store.dispatch({
    type: Types.SET_STATE_MODAL,
    payload: {
      modal,
    },
  }),
  closeModals: () => Store.dispatch({
    type: Types.SET_STATE_MODAL,
    payload: {
      modal: {
        keyModal: null,
        visibility: false,
      },
    },
  })
};
