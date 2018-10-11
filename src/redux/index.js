import { combineReducers, compose, createStore, applyMiddleware } from 'redux'
import reduxPromiseMiddleware from 'redux-promise-middleware'
import { mainReducer } from './reducer/index'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = createStore(
    combineReducers({ mainReducer }),
    composeEnhancers(applyMiddleware(reduxPromiseMiddleware()))
)
