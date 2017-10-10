/**
 * Created by WAN on 2017/9/11.
 */

'use strict';

import * as types from './ActionTypes';
import config from '../config';

// function getBookDetail(bookId) {
//     return(dispatch: any) =>{
//         let apiUrl = config.apiUrl;
//         fetch(apiUrl.book.detail,{
//             method: 'GET',
//         }).then((response) =>{
//             response.json().then((json) =>{
//                 if (json.ok){
//                     dispatch({
//                         type: types.GET_RANK_LIST_ACTION,
//                         rankList: json,
//                     })
//                 } else {
//                     //someThing error
//                 }
//             });
//         }).catch(function(error) {
//             //someThing error
//         });
//     }
// }

function getBookShelves() {
    let bookshelves = realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true);
    return(dispatch: any) =>{
        dispatch({
            type: types.GET_BOOK_SHELVES_ACTION,
            bookShelves: bookshelves,
        })
    }
}

function deleteBooksFromShelves(bookIds) {
    for(let i=0;i<bookIds.length;i++){
        let book = realm.objectForPrimaryKey('HistoryBook', bookIds[i]);
        realm.write(() => {
            realm.delete(book);
        });
    }
    let bookshelves = realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true);
    return(dispatch: any) =>{
        dispatch({
            type: types.GET_BOOK_SHELVES_ACTION,
            bookShelves: bookshelves,
        })
    }
}

function getBooksInfo() {
    return(dispatch: any) =>{
        let bookshelves = realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true);
        for(let i=0;i<bookshelves.length;i++){
            dispatch(getBookInfoForShelves(bookshelves[i].bookId))
        }
        let newBookshelves = realm.objects('HistoryBook').filtered('isToShow = 1').sorted('sortNum', true);
        if(bookshelves !== newBookshelves){
            dispatch({
                type: types.GET_BOOK_SHELVES_ACTION,
                bookShelves: newBookshelves,
            })
        }
    }
}

function getBookInfoForShelves(book) {
    let bookId = book.bookId;
    let nowChapterTime = book.nowChapterTime;
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.book.detail+bookId,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if(nowChapterTime!==json.updated){
                    realm.write(() => {
                        realm.create('HistoryBook', {bookId: json._id,nowChapterTime:json.updated}, true)
                    })
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getBookDetail(bookId) {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.book.detail+bookId,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                dispatch({
                    type: types.GET_BOOK_DETAIL_ACTION,
                    bookDetail: json,
                })
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getMonthRankDetail(rankId) {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.chartsDetail+rankId,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.ranking;
                    dispatch({
                        type: types.GET_MONTH_RANK_DETAIL_LIST_ACTION,
                        rankDetailList: data,
                    })
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getTotalRankDetail(rankId) {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.chartsDetail+rankId,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.ranking;
                    dispatch({
                        type: types.GET_TOTAL_RANK_DETAIL_LIST_ACTION,
                        rankDetailList: data,
                    })
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getBookList(pageNum){
    const pageSize = 20;
    let start = 0;
    if(typeof(pageNum) !== 'undefined' && pageNum>1){
        start = (pageNum-1)*pageSize;
    }
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.bookList+'?duration=last-seven-days&sort=collectorCount&start='+start,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.bookLists;
                    dispatch({
                        type: types.GET_BOOK_LIST_ACTION,
                        bookLists: data,
                        pageNumber:pageNum
                    })
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getBookListDetail(bookListId) {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.bookListDetail+bookListId,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.bookList;
                    dispatch({
                        type: types.GET_BOOK_LIST_DETAIL_ACTION,
                        bookList: data,
                    })
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getCategoryList() {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.categoryListV2,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json1) =>{
                if (json1.ok){
                    let categoryListV2Temp = json1;
                    fetch(apiUrl.discover.categoryList,{
                        method: 'GET',
                    }).then((response) =>{
                        response.json().then((json2) =>{
                            if (json2.ok){
                                let categoryListTemp = json2;
                                dispatch({
                                    type: types.GET_CATEGORY_LIST_ACTION,
                                    categoryList: categoryListTemp,
                                    categoryListV2:categoryListV2Temp,
                                })
                            } else {
                                //someThing error
                            }
                        });
                    }).catch(function(error) {
                        //someThing error
                    });
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });

    }
}

function getCategoryListV2() {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.categoryListV2,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json;
                    dispatch({
                        type: types.GET_CATEGORY_LIST_V2_ACTION,
                        categoryListV2: data,
                    })
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getSortDetail(major,pageNum,type,gender) {
    const pageSize = 20;
    let start = 0;
    if(typeof(pageNum) !== 'undefined' && pageNum>1){
        start = (pageNum-1)*pageSize;
    }
    if(gender === 'press'){
        return(dispatch: any) =>{
            let apiUrl = config.apiUrl;
            fetch(apiUrl.discover.categoryBooks+'?type='+type+'&&limit=20&major='+major+'&start='+start+'&gender='+gender,{
                method: 'GET',
            }).then((response) =>{
                response.json().then((json) =>{
                    if (json.ok){
                        let data = json.books;
                        dispatch({
                            type: types.GET_SORT_DETAIL_LIST_ACTION,
                            sortType:gender,
                            pressDetailList: data,
                            pageNumber:pageNum,
                        })
                    } else {
                        //someThing error
                    }
                });
            }).catch(function(error) {
                //someThing error
            });
        }
    }else{
        return(dispatch: any) =>{
            let apiUrl = config.apiUrl;
            fetch(apiUrl.discover.categoryBooks+'?type='+type+'&&limit=20&major='+major+'&start='+start+'&gender='+gender,{
                method: 'GET',
            }).then((response) =>{
                response.json().then((json) =>{
                    if (json.ok){
                        let data = json.books;
                        if(type === "hot"){
                            dispatch({
                                type: types.GET_SORT_DETAIL_LIST_ACTION,
                                sortType:type,
                                hotDetailList: data,
                                pageNumber:pageNum,
                            })
                        }else if(type === "new"){
                            dispatch({
                                type: types.GET_SORT_DETAIL_LIST_ACTION,
                                sortType:type,
                                newDetailList: data,
                                pageNumber:pageNum,
                            })
                        }
                        else if(type === "reputation"){
                            dispatch({
                                type: types.GET_SORT_DETAIL_LIST_ACTION,
                                sortType:type,
                                reputationDetailList: data,
                                pageNumber:pageNum,
                            })
                        }
                        else if(type === "over"){
                            dispatch({
                                type: types.GET_SORT_DETAIL_LIST_ACTION,
                                sortType:type,
                                overDetailList: data,
                                pageNumber:pageNum,
                            })
                        }
                    } else {
                        //someThing error
                    }
                });
            }).catch(function(error) {
                //someThing error
            });
        }
    }

}

function getSearchHotWord() {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.search.searchHotWord,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.hotWords;
                    dispatch({
                        type: types.GET_SEARCH_HOT_WORLD_ACTION,
                        searchHotWord: data,
                    })
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getSearchBookListForKeyWord(keyWord,pageNum) {
    const pageSize = 20;
    let start = 0;
    if(typeof(pageNum) !== 'undefined' && pageNum>1){
        start = (pageNum-1)*pageSize;
    }
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        dispatch(setLoadState(true));
        fetch(apiUrl.search.searchBooks+keyWord+'&limit=20&start='+start,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.books;
                    dispatch({
                        type: types.GET_SEARCH_BOOK_LIST_ACTION,
                        searchBookList: data,
                        pageNumber:pageNum,
                    });
                    dispatch(setLoadState(false));
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getSearchBookListForAuthor(author,pageNum) {
    const pageSize = 20;
    let start = 0;
    if(typeof(pageNum) !== 'undefined' && pageNum>1){
        start = (pageNum-1)*pageSize;
    }
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        dispatch(setLoadState(true));
        fetch(apiUrl.book.authorBookList+'?author='+author+'&limit=20&start='+start,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.books;
                    dispatch({
                        type: types.GET_SEARCH_BOOK_LIST_ACTION,
                        searchBookList: data,
                        pageNumber:pageNum,
                    });
                    dispatch(setLoadState(false));
                } else {
                    //someThing error
                }
            });
        }).catch(function(error) {
            //someThing error
        });
    }
}

function getSearchBookListForTag(tag,pageNum) {
    const pageSize = 20;
    let start = 0;
    if(typeof(pageNum) !== 'undefined' && pageNum>1){
        start = (pageNum-1)*pageSize;
    }
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        dispatch(setLoadState(true));
        fetch(apiUrl.book.tagBookList+'?tags='+tag+'&limit=20&start='+start,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.books;
                    dispatch({
                        type: types.GET_SEARCH_BOOK_LIST_ACTION,
                        searchBookList: data,
                        pageNumber:pageNum,
                    });
                    dispatch(setLoadState(false));
                } else {
                    //someThing error
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
            type: types.SET_BOOK_LOADING_NEW_STATE_ACTION,
            loadBookState:state
        });
    }
}

module.exports = {
    getBookDetail,
    getBookShelves,
    deleteBooksFromShelves,
    getBookList,
    getBookListDetail,
    getCategoryList,
    getCategoryListV2,
    getSortDetail,
    getSearchHotWord,
    getSearchBookListForKeyWord,
    getSearchBookListForAuthor,
    getSearchBookListForTag,
    getBooksInfo
};
