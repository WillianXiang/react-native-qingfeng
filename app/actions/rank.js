/**
 * Created by WAN on 2017/9/11.
 */

'use strict';

import * as types from './ActionTypes';
import config from '../config';

function getRankList() {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.charts,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    dispatch({
                        type: types.GET_RANK_LIST_ACTION,
                        rankList: json,
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

function getWeekRankDetail(rankId) {
    return(dispatch: any) =>{
        let apiUrl = config.apiUrl;
        fetch(apiUrl.discover.chartsDetail+rankId,{
            method: 'GET',
        }).then((response) =>{
            response.json().then((json) =>{
                if (json.ok){
                    let data = json.ranking;
                    dispatch({
                        type: types.GET_WEEK_RANK_DETAIL_LIST_ACTION,
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

module.exports = {
    getRankList,
    getWeekRankDetail,
    getMonthRankDetail,
    getTotalRankDetail
};
