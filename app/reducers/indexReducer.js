'use strict';

let { combineReducers } = require('redux');

module.exports = combineReducers({
    rank:require('./rank'),
    book:require('./book'),
    read:require('./read'),
});