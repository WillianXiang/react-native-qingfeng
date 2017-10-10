/**
 * Created by WAN on 2017/9/11.
 */

'use strict';

import * as types from '../actions/ActionTypes'

export type State = {
    bookDetail : any;
    bookLists:Array <any>;
    hotDetailList:Array <any>;
    newDetailList:Array <any>;
    reputationDetailList:Array <any>;
    overDetailList:Array <any>;
    newBookDetails:Array <any>;
    searchBookList:Array <any>;
    pressDetailList:Array <any>;
};

const initial: State = {
    bookDetail : {},
    bookLists:[],
    hotDetailList:[],
    newDetailList:[],
    reputationDetailList:[],
    overDetailList:[],
    newBookDetails:[],
    searchBookList:[],
    pressDetailList:[],
};

function book(state: State = initial, action): State {
    switch (action.type){
        case types.GET_BOOK_DETAIL_ACTION:{
            return {
                ...state,
                bookDetail:action.bookDetail,
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
        case types.GET_BOOK_SHELVES_ACTION:{
            return {
                ...state,
                bookShelves:action.bookShelves,
            }
        }
        case types.GET_SHELVES_BOOK_DETAIL_ACTION:{
            state.newBookDetails[action.newBookDetail._id] = action.newBookDetail.updated;
            return {
                ...state,
                newBookDetails:state.newBookDetails,
            }
        }
        case types.GET_BOOK_LIST_ACTION:{
            if(action.pageNumber>1){
                let bookListTemp = [];
                bookListTemp = state.bookLists.concat(action.bookLists);
                action.bookLists = bookListTemp;
            }
            return {
                ...state,
                bookLists:action.bookLists,
            }
        }
        case types.GET_BOOK_LIST_DETAIL_ACTION:{
            return {
                ...state,
                bookList:action.bookList,
            }
        }
        case types.GET_CATEGORY_LIST_ACTION:{
            return {
                ...state,
                categoryList:action.categoryList,
                categoryListV2:action.categoryListV2,
            }
        }
        case types.GET_SORT_DETAIL_LIST_ACTION:{
            if(action.sortType === "hot"){
                if(action.pageNumber>1){
                    let detailListTemp = [];
                    detailListTemp = state.hotDetailList.concat(action.hotDetailList);
                    action.hotDetailList = detailListTemp;
                }
                return {
                    ...state,
                    hotDetailList:action.hotDetailList,
                }
            }else if(action.sortType === "new"){
                if(action.pageNumber>1){
                    let detailListTemp = [];
                    detailListTemp = state.newDetailList.concat(action.newDetailList);
                    action.newDetailList = detailListTemp;
                }
                return {
                    ...state,
                    newDetailList:action.newDetailList,
                }
            }
            else if(action.sortType === "reputation"){
                if(action.pageNumber>1){
                    let detailListTemp = [];
                    detailListTemp = state.reputationDetailList.concat(action.reputationDetailList);
                    action.reputationDetailList = detailListTemp;
                }
                return {
                    ...state,
                    reputationDetailList:action.reputationDetailList,
                }
            }
            else if(action.sortType === "over"){
                if(action.pageNumber>1){
                    let detailListTemp = [];
                    detailListTemp = state.overDetailList.concat(action.overDetailList);
                    action.overDetailList = detailListTemp;
                }
                return {
                    ...state,
                    overDetailList:action.overDetailList,
                }
            }
            else if(action.sortType === "press"){
                if(action.pageNumber>1){
                    let detailListTemp = [];
                    detailListTemp = state.pressDetailList.concat(action.pressDetailList);
                    action.pressDetailList = detailListTemp;
                }
                return {
                    ...state,
                    pressDetailList:action.pressDetailList,
                }
            }
        }
        case types.GET_SEARCH_HOT_WORLD_ACTION:{
            return {
                ...state,
                searchHotWord:action.searchHotWord,
            }
        }
        case types.GET_SEARCH_BOOK_LIST_ACTION:{
            if(action.pageNumber>1){
                let searchBookList = [];
                searchBookList = state.searchBookList.concat(action.searchBookList);
                action.searchBookList = searchBookList;
            }
            return {
                ...state,
                searchBookList:action.searchBookList,
            }
        }
        case types.SET_BOOK_LOADING_NEW_STATE_ACTION:{
            return {
                ...state,
                loadBookState:action.loadBookState,
            }
        }
        default:
            return state;
    }
}


module.exports = book;
