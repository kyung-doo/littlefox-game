import Redux, { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Reducer } from './reducer';

const env = process.env.NODE_ENV;
const middlewares = [thunk];
if(env === 'development') {
   const { logger } = require("redux-logger");
   middlewares.push(logger);
}

let store: Redux.Store;

if(env === 'development') {
   const composeWithDevTools = require('redux-devtools-extension').composeWithDevTools;
   store = createStore(Reducer, composeWithDevTools(applyMiddleware(...middlewares)));
} else {
   store = createStore(Reducer, applyMiddleware(...middlewares));
}

export default store;