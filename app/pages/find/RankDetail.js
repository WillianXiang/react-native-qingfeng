/**
 * Created by WAN on 2017/9/11.
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
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'
import config from '../../config';
import {getWeekRankDetail,getMonthRankDetail,getTotalRankDetail} from '../../actions/rank';

class RankDetail extends Component {

    constructor(props) {
        super(props);
        // if you want to listen on navigator events, set this up
        this.state = {
            headerTitle:'',
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.title}`,
    });

    componentDidMount(){
        this.state.headerTitle = this.props.navigation.state.params.title;
        let weekRank = this.props.navigation.state.params._id;
        let monthRank = this.props.navigation.state.params.monthRank;
        let totalRank = this.props.navigation.state.params.totalRank;
        this.props.dispatch(getWeekRankDetail(weekRank));
        this.props.dispatch(getMonthRankDetail(monthRank));
        this.props.dispatch(getTotalRankDetail(totalRank));
    }

    toBookInfo = (bookId) =>{
        const { navigate } = this.props.navigation;
        navigate('BookInfo',bookId);
    };

    renderRankDetailDataItem  = (item) =>{
        let rowData = item.item;
        let rowId = rowData._id;
        let author = rowData.author;
        let shortIntro = rowData.shortIntro;
        let latelyFollower = rowData.latelyFollower;
        let retentionRatio = rowData.retentionRatio;
        let coverUrl = rowData.cover;
        let index =item.index;
        if(!rowData.collapse){
            return (
            <TouchableOpacity
                key={index}
                onPress ={() => this.toBookInfo(rowId)}
                style={{flexDirection:'row',height:100}}>
                <Image
                    style={styles.itemImage}
                    source={coverUrl
                        ? {uri: (config.IMG_BASE_URL + coverUrl)}
                        : require('../../res/default.jpg')}
                />
                <View style={{flex:1,flexDirection:'column',justifyContent:'center',marginRight: 14,}}>
                    <Text style={{fontSize:14,fontWeight:'bold',color:'#000'}}>{rowData.title}</Text>
                    <Text style={{fontSize:13,color:'#000',marginTop:1,marginBottom:1}}>{author}</Text>
                    <Text style={{fontSize:13,marginTop:1,marginBottom:1}} numberOfLines={2}>{shortIntro}</Text>
                </View>
            </TouchableOpacity>
            )
        }
    };

    renderRank = (index) =>{
        let rankDetailList = [];
        if(index === 1){
            rankDetailList = typeof(this.props.weekRankDetailList)!== 'undefined'?this.props.weekRankDetailList.books:[];
        }else if(index === 2){
            rankDetailList = typeof(this.props.monthRankDetailList)!== 'undefined'?this.props.monthRankDetailList.books:[];
        }else if(index === 3){
            rankDetailList = typeof(this.props.totalRankDetailList)!== 'undefined'?this.props.totalRankDetailList.books:[];
        }
        return(
            <FlatList
                initialNumToRender = {10}
                data={rankDetailList}
                renderItem={this.renderRankDetailDataItem}
                keyExtractor={(item, index) => index}
                getItemLayout={(data,index)=>(
                    {length: 100, offset: (100) * index, index}
                )}
            />
        )
    };

    render() {
        return (
            <View style={styles.container}>
                {typeof(this.props.monthRankDetailList)!== 'undefined'?(
                    <ScrollableTabView
                        renderTabBar={() => <DefaultTabBar/>}
                        tabBarUnderlineStyle={{backgroundColor:'#1B89EB'}}
                        tabBarActiveTextColor='#1B89EB'
                        tabBarTextStyle={{fontSize: 16}}
                    >
                        <View tabLabel='周榜'>
                            {this.renderRank(1)}
                        </View>
                        <View tabLabel='月榜'>
                            {this.renderRank(2)}
                        </View>
                        <View tabLabel='总榜'>
                            {this.renderRank(3)}
                        </View>
                    </ScrollableTabView>
                ):(
                    this.renderRank(1)
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
    itemImage: {
        marginLeft: 14,
        marginRight: 14,
        alignSelf: 'center',
        width: 50,
        height: 75
    },
});


function select(store: any, props: Props) {
    return {
        weekRankDetailList:store.rank.weekRankDetailList,
        monthRankDetailList:store.rank.monthRankDetailList,
        totalRankDetailList:store.rank.totalRankDetailList,
        ...props
    };
}

export default connect(select)(RankDetail)