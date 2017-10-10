/**
 * Created by WAN on 2017/9/8.
 */

import React, { Component } from 'react'
import {
    View,
    Image,
    Text,
    StatusBar,
    StyleSheet,
    Platform,
    Button,
    FlatList,
    Dimensions
} from 'react-native'
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import config from '../../config';
import {getRankList} from '../../actions/rank';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Rank extends Component {

    static navigationOptions = {
        // headerTitle : '排行榜',

    };

    componentWillMount(){
        this.props.dispatch(getRankList());
    }

    toRankDetail = (rowData) =>{
        const { navigate } = this.props.navigation;
        navigate('RankDetail',rowData);
    };

    renderMaleRankItem  = (item) =>{
        let rowData = item.item;
        let coverUrl = rowData.cover;
        let index =item.index;
        if(!rowData.collapse){
            return (
                <ListItem
                    roundAvatar
                    key={index}
                    title={rowData.title}
                    avatar={coverUrl
                        ? {uri: (config.IMG_BASE_URL + coverUrl)}
                        : require('../../res/default.jpg')}
                    onPress ={() => this.toRankDetail(rowData)}
                />
            )
        }
    };

    renderFemaleRankItem  = (item) =>{
        let rowData = item.item;
        let coverUrl = rowData.cover;
        let index =item.index;
        if(!rowData.collapse){
            return (
                <ListItem
                    roundAvatar
                    key={index}
                    title={rowData.title}
                    avatar={coverUrl
                        ? {uri: (config.IMG_BASE_URL + coverUrl)}
                        : require('../../res/default.jpg')}
                    onPress ={() => this.toRankDetail(rowData)}
                />
            )
        }
    };

    render() {
        let maleRankList = typeof(this.props.rankList.male)!== 'undefined'?this.props.rankList.male:[];
        let femaleRankList = typeof(this.props.rankList.male)!== 'undefined'?this.props.rankList.female:[];
        return (
            <View style={styles.container}>
                <View style={{padding:5}}>
                    <Text style={{marginLeft:10,fontSize:16}}>男生</Text>
                </View>
                <FlatList
                    initialNumToRender = {5}
                    data={maleRankList}
                    renderItem={this.renderMaleRankItem}
                    keyExtractor={(item, index) => index}
                />
                <View style={{padding:5}}>
                    <Text style={{marginLeft:10,fontSize:16}}>女生</Text>
                </View>
                <FlatList
                    initialNumToRender = {5}
                    data={femaleRankList}
                    renderItem={this.renderFemaleRankItem}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
});


function select(store: any, props: Props) {
    return {
        rankList:store.rank.rankList,
        ...props
    };
}

export default connect(select)(Rank)