import { combineReducers, compose, createStore } from "redux";
import mainReducer from "./reducer/index";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(
    combineReducers({ mainReducer }),
    composeEnhancers()
);
