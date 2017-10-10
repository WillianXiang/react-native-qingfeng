/**
 * Created by WAN on 2017/9/12.
 */

'use strict';

import Toast from 'react-native-root-toast';
import * as types from './ActionTypes';
import config from '../config';

function getBookChapters(bookId) {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        dispatch({
            type: types.CLEAR_CHAPTERS_LIST_ACTION,
        });
        fetch(apiUrl.read.readBookChapterList+bookId+'?view=chapters',{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    dispatch({
                        type: types.GET_CHAPTERS_LIST_ACTION,
                        mixTocChapters: json.mixToc.chapters,
                    })
                }else{
                    Toast.show("此书籍的资源失效了！",{position:Toast.positions.BOTTOM - 35,duration:Toast.durations.SHORT});
                    dispatch({
                        type: types.REQUEST_CHAPTERS_SOURCE_INVALID,
                    });
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function restoreRequestInvalidState() {
    return(dispatch: any) =>{
        dispatch({
            type: types.RESTORE_REQUEST_CHAPTERS_SOURCE_INVALID,
        });
    }
}

function getBookChapterDetail(chapterUrl) {
    let tempChapterUrl = chapterUrl.replace(/\//g, '%2F').replace('?', '%3F');
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        dispatch(setLoadState(true));
        fetch(apiUrl.read.readBookChapterDetail+tempChapterUrl,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let chapter = json.chapter;
                    dispatch({
                        type: types.GET_CHAPTER_DETAIL_ACTION,
                        chapter: chapter,
                    });
                    dispatch(setLoadState(false));
                } else {
                    Toast.show("章节信息发生错误！",{position:Toast.positions.BOTTOM - 35,duration:Toast.durations.LONG});
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function setLoadState(state) {
    return (dispatch: any) =>{
        dispatch({
            type: types.SET_LOADING_NEW_STATE_ACTION,
            loadReadState:state
        });
    }
}


module.exports = {
    getBookChapters,
    getBookChapterDetail,
    restoreRequestInvalidState
};
