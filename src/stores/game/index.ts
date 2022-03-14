import Redux, { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Reducer } from './reducer';

const env = process.env.NODE_ENV;
const middlewares = [thunk];
if(env === 'development') {
   const { logger } = require("redux-logger");
   middlewares.push(logger);
}

const action = (state: any, action: any) => {
   return action;
}

const reducers = combineReducers({
   root: Reducer,
   action
});

let store: Redux.Store;
if(env === 'development') {
   const composeWithDevTools = require('redux-devtools-extension').composeWithDevTools;
   store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)));
} else {
   store = createStore(reducers, applyMiddleware(...middlewares));
}

export default store;