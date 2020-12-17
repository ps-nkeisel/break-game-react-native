import { createStore, compose, applyMiddleware } from 'redux';
import reducers from './ducks';
import { persistStore, persistReducer } from 'redux-persist';
import DefaultStorage from 'redux-persist/lib/storage' // defaults to localStorage for web
import FacebookStorage from './storage' // defaults to localStorage for web
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

var storage = null;
if (window.fbEnv){
    console.log("Using Facebook storage in redux persist")
    storage = FacebookStorage;
}else{
    console.log("%c Using local cookies in redux persist",'background: #000; color: #bada55')
    storage = DefaultStorage;
}

const persistConfig = {
    key: 'mainStorage20201124',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    blacklist: ["gameplay","modals"]
  }

let persistedReducer = persistReducer(persistConfig,reducers)

const middlewares = [];
const composer = compose(applyMiddleware(...middlewares));
const _store = createStore(persistedReducer, composer);

let _persistor = persistStore(_store)



export var persistor = _persistor;
export var store = _store;
export default _store;
