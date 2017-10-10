/**
 * Created by WAN on 2017/9/12.
 */
'use strict';

import * as types from '../actions/ActionTypes'

export type State = {
    mixToc : any;
    chapter : any;
    mixTocChapters:Array <any>;
};

const initial: State = {
    mixToc : {},
    chapter :  {},
    mixTocChapters:[],
};

function read(state: State = initial, action): State {
    switch (action.type){
        case types.CLEAR_CHAPTERS_LIST_ACTION:{
            return {
                ...state,
                mixTocChapters:[],
            }
        }
        case types.GET_CHAPTERS_LIST_ACTION:{
            // let keyValueChapter = action.mixToc.chapters;
            // let chaptersTemp = [];
            // keyValueChapter.map((item,tIndex)=>{chaptersTemp.push({tIndex,item})});
            return {
                ...state,
                mixTocChapters:action.mixTocChapters,
                // keyValueChapters:chaptersTemp,
            }
        }
        case types.REQUEST_CHAPTERS_SOURCE_INVALID:{
            return {
                ...state,
                chaptersSourceInvalid:true,
            }
        }
        case types.RESTORE_REQUEST_CHAPTERS_SOURCE_INVALID:{
            return {
                ...state,
                chaptersSourceInvalid:false,
            }
        }
        case types.GET_CHAPTER_DETAIL_ACTION:{
            return {
                ...state,
                chapter:action.chapter,
            }
        }
        case types.SET_LOADING_NEW_STATE_ACTION:{
            return {
                ...state,
                loadReadState:action.loadReadState,
            }
        }
        default:
            return state;
    }
}


module.exports = read;