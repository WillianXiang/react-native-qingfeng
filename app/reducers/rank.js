/**
 * Created by WAN on 2017/9/11.
 */

'use strict';

import * as types from '../actions/ActionTypes'

export type State = {
    rankList : any;
};

const initial: State = {
    rankList : {},
};

function rank(state: State = initial, action): State {
    switch (action.type){
        case types.GET_RANK_LIST_ACTION:{
            return {
                ...state,
                rankList:action.rankList,
            }
        }
        case types.GET_WEEK_RANK_DETAIL_LIST_ACTION:{
            return {
                ...state,
                weekRankDetailList:action.rankDetailList,
            }
        }
        case types.GET_MONTH_RANK_DETAIL_LIST_ACTION:{
            return {
                ...state,
                monthRankDetailList:action.rankDetailList,
            }
        }
        case types.GET_TOTAL_RANK_DETAIL_LIST_ACTION:{
            return {
                ...state,
                totalRankDetailList:action.rankDetailList,
            }
        }
        default:
            return state;
    }
}


module.exports = rank;
