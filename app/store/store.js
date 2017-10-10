/**
 * Created by WAN on 2017/9/6.
 */

import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';
import rootReducer from '../reducers/indexReducer';

const logger = createLogger();

let store = createStore(
    rootReducer,
    {},
    compose(applyMiddleware(thunkMiddleware,logger),
    window.devToolsExtension?window.devToolsExtension():f =>f)
);

export default store