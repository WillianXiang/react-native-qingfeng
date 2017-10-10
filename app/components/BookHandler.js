/**
 * Created by WAN on 2017/9/14.
 */

import config from '../config';


/**
 * 是否已经保存过当前书籍
 * @param {string} bookId 书籍id
 */
function hasSaveBook(bookId) {
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    if(typeof(book) === 'undefined'||book.isToShow === 0){
        return false;
    }else{
        return true;
    }
}

/**
 * 是否已经保存过当前书籍
 * @param {string} bookId 书籍id
 */
function saveChapterRecordById(bookId,chapterNum,chapterUrl,chapterTitle) {

    let apiUrl = config.apiUrl;
    fetch(apiUrl.book.detail+bookId,{
        method: 'GET',
    }).then((response) =>{
        response.json().then((json) =>{
            let data = json;
            if(data){
                saveBookToRealm(data,chapterNum,chapterUrl,chapterTitle)
            }
        });
    }).catch(function(error) {
        //someThing error
    });
}


/**
 * 向数据库中保存当前书籍的记录
 */
function saveBookToRealm(bookDetail,chapterNum, chapterUrl,chapterTitle) {
    if(typeof(chapterNum) === 'undefined') chapterNum = 0;
    if(typeof(chapterUrl) === 'undefined') chapterUrl = '';
    if(typeof(chapterTitle) === 'undefined') chapterTitle = '';
    let books = realm.objects('HistoryBook').sorted('sortNum');
    let book = realm.objectForPrimaryKey('HistoryBook', bookDetail._id);
    realm.write(() => {
        if (book) {
            if (book.bookId == books[books.length - 1].bookId) {
                realm.create('HistoryBook', {bookId: book.bookId, isToShow: 1,historyChapterNum:chapterNum,historyChapterUrl:chapterUrl,historyChapterTitle:chapterTitle,}, true)
            } else {
                let sortNum = books[books.length - 1].sortNum + 1;
                realm.create('HistoryBook', {bookId: book.bookId, isToShow: 1, sortNum: books[books.length - 1].sortNum + 1, historyChapterNum: chapterNum,historyChapterUrl:chapterUrl,historyChapterTitle:chapterTitle}, true)
            }
        } else {
            realm.create('HistoryBook', {
                bookId: bookDetail._id,
                bookName: bookDetail.title,
                bookUrl: bookDetail.cover,
                lastChapterTitle: bookDetail.lastChapter,
                historyChapterNum: chapterNum,
                historyChapterUrl:'',
                historyChapterTitle:chapterTitle,
                lastChapterTime: bookDetail.updated,
                nowChapterTime:bookDetail.updated,
                saveTime: new Date(),
                sortNum: books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0,
                isToShow: 1
            });
        }
    })
}

function saveSettingToRealm(item) {
    let readTheme = '';
    let readTextSize = 18;
    if(typeof(item.readTheme)!== 'undefined') readTheme = item.readTheme;
    if(typeof(item.readTextSize)!== 'undefined') readTextSize = item.readTextSize;
    let setting = realm.objectForPrimaryKey('SystemSetting', 1);
    realm.write(() => {
        if (setting) {
           realm.create('SystemSetting', {settingPrimary:1,readTheme: readTheme, readTextSize: readTextSize,}, true)
        } else {
            realm.create('SystemSetting', {
                readTheme: readTheme,
                readTextSize: readTextSize,
                settingPrimary:1,
            });
        }
    })
}

/**
 * 向数据库中保存当前书籍的记录
 */
// function saveBookToRealm(bookDetail) {
//     let books = realm.objects('HistoryBook').sorted('sortNum');
//     let book = realm.objectForPrimaryKey('HistoryBook', bookDetail._id);
//     realm.write(() => {
//         if(book) {
//             realm.create('HistoryBook', {bookId: bookDetail._id, isToShow: 1}, true)
//         } else {
//             realm.create('HistoryBook', {
//                 bookId: bookDetail._id,
//                 bookName: bookDetail.title,
//                 bookUrl: bookDetail.cover,
//                 lastChapterTitle: bookDetail.lastChapter,
//                 historyChapterNum: 0,
//                 lastChapterTime: bookDetail.updated,
//                 saveTime: new Date(),
//                 sortNum: books && books.length > 0 ? books[books.length - 1].sortNum + 1 : 0,
//                 isToShow: 1
//             });
//         }
//     })
// }

/**
 * 从数据库中删除当前书籍的记录
 */
function deleteBookToRealm(bookDetail) {
    let book = realm.objectForPrimaryKey('HistoryBook', bookDetail._id);
    realm.write(() => {
        realm.delete(book);
    })
}

/**
 * 从数据库中删除当前书籍的记录
 */
function deleteBookToRealmById(bookId) {
    let book = realm.objectForPrimaryKey('HistoryBook', bookId);
    realm.write(() => {
        realm.delete(book);
    })
}

/**
 * 添加或删除数据库中相关书籍
 */
function _addOrDeleteBook(bookDetail) {
    if (this.state.hasSaveBook) {
        this.deleteBookToRealm(bookDetail)
    } else {
        this.saveBookToRealm(bookDetail)
    }
    this._hasSaveBook(bookDetail._id)
}

module.exports = {
    saveBookToRealm,
    deleteBookToRealm,
    deleteBookToRealmById,
    hasSaveBook,
    saveChapterRecordById,
    saveSettingToRealm
};