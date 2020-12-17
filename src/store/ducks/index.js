import { combineReducers } from 'redux';

import AppReducer from '@/store/ducks/app';
import UserReducer from '@/store/ducks/user';
import GamePlayReducer from '@/store/ducks/gameplay';
import ModalsReducer from '@/store/ducks/modals';

const reducers = combineReducers({
  app: AppReducer,
  user: UserReducer,
  gameplay: GamePlayReducer,
  modals: ModalsReducer
});

export default reducers;