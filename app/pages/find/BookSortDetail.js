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
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view'

import config from '../../config';
import {getSortDetail} from '../../actions/book';

class BookSortDetail extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.major}`,
    });

    constructor(props) {
        super(props);
        this.state = {
            hotDetailList:[],
            newDetailList:[],
            reputationDetailList:[],
            overDetailList:[],
            pressDetailList:[],

            hotPageNum:1,
            newPageNum:1,
            reputationPageNum:1,
            overPageNum:1,
            pressPageNum:1,
        }
    }

    componentDidMount(){
        if(this.props.navigation.state.params.gender === 'press'){
            this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,1,'',this.props.navigation.state.params.gender));
        }else{
            this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,1,'hot',this.props.navigation.state.params.gender));
            this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,1,'new',this.props.navigation.state.params.gender));
            this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,1,'reputation',this.props.navigation.state.params.gender));
            this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,1,'over',this.props.navigation.state.params.gender));
        }
    }

    componentWillReceiveProps(nextProps) {
        if(typeof(nextProps.hotDetailList)!== 'undefined'){
            this.state.hotDetailList = nextProps.hotDetailList;
        }
        if(typeof(nextProps.newDetailList)!== 'undefined'){
            this.state.newDetailList = nextProps.newDetailList;
        }
        if(typeof(nextProps.reputationDetailList)!== 'undefined'){
            this.state.reputationDetailList = nextProps.reputationDetailList;
        }
        if(typeof(nextProps.overDetailList)!== 'undefined'){
            this.state.overDetailList = nextProps.overDetailList;
        }
        if(typeof(nextProps.pressDetailList)!== 'undefined'){
            this.state.pressDetailList = nextProps.pressDetailList;
        }
    }

    toBookInfo = (bookId) =>{
        const { navigate } = this.props.navigation;
        navigate('BookInfo',bookId);
    };

    renderSortDetailListItem = (rowData) =>{
        let rowId = rowData.item._id;
        let title = rowData.item.title;
        let author = rowData.item.author;
        let shortIntro = rowData.item.shortIntro;
        let latelyFollower = rowData.item.latelyFollower;
        let retentionRatio = rowData.item.retentionRatio;
        let coverUrl = rowData.item.cover;
        let lastChapter = rowData.item.lastChapter;
        let index =rowData.index;
        return (
            <TouchableOpacity
                key={rowId}
                onPress ={() => this.toBookInfo(rowId)}
                style={{flexDirection:'row',height:100}}>
                <Image
                    style={styles.itemImage}
                    source={coverUrl
                        ? {uri: (config.IMG_BASE_URL + coverUrl)}
                        : require('../../res/default.jpg')}
                />
                <View style={{flex:1,flexDirection:'column',justifyContent:'center',marginRight: 14,}}>
                    <Text style={{fontSize:14,fontWeight:'bold',color:'#000'}}>{title}</Text>
                    <Text style={{fontSize:13,color:'#000',marginTop:1,marginBottom:1}}>{author}</Text>
                    <Text style={{fontSize:13,marginTop:1,marginBottom:1}} numberOfLines={2}>{shortIntro}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    loadMoreForHot = () =>{
        this.state.hotPageNum+= 1;
        this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,this.state.hotPageNum,'hot',this.props.navigation.state.params.gender));
    };

    loadMoreForNew = () =>{
        this.state.newPageNum += 1;
        this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,this.state.newPageNum,'new',this.props.navigation.state.params.gender));
    };

    loadMoreForReputation = () =>{
        this.state.reputationPageNum +=1;
        this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,this.state.reputationPageNum,'reputation',this.props.navigation.state.params.gender));
    };

    loadMoreForOver = () =>{
        this.state.overPageNum += 1;
        this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,this.state.overPageNum,'over',this.props.navigation.state.params.gender));
    };

    loadMoreForPress = () =>{
        this.state.pressPageNum += 1;
        this.props.dispatch(getSortDetail(this.props.navigation.state.params.major,this.state.pressPageNum,'',this.props.navigation.state.params.gender));
    };

    render() {
        return (
            <View style={styles.container}>
                {this.props.navigation.state.params.gender === 'press'?(
                    <FlatList
                        initialNumToRender = {20}
                        data={this.state.pressDetailList}
                        renderItem={this.renderSortDetailListItem}
                        keyExtractor={(item, index) => index}
                        onEndReachedThreshold={40}
                        onEndReached={()=>this.loadMoreForPress()}
                    />
                ):(
                    <ScrollableTabView
                        renderTabBar={() => <DefaultTabBar/>}>
                        <View tabLabel='热门'>
                            <FlatList
                                initialNumToRender = {20}
                                data={this.state.hotDetailList}
                                renderItem={this.renderSortDetailListItem}
                                keyExtractor={(item, index) => index}
                                onEndReachedThreshold={40}
                                onEndReached={()=>this.loadMoreForHot()}
                            />
                        </View>
                        <View tabLabel='新书'>
                            <FlatList
                                initialNumToRender = {20}
                                data={this.state.newDetailList}
                                renderItem={this.renderSortDetailListItem}
                                keyExtractor={(item, index) => index}
                                onEndReachedThreshold={40}
                                onEndReached={()=>this.loadMoreForNew()}
                            />
                        </View>
                        <View tabLabel='口碑'>
                            <FlatList
                                initialNumToRender = {20}
                                data={this.state.reputationDetailList}
                                renderItem={this.renderSortDetailListItem}
                                keyExtractor={(item, index) => index}
                                onEndReachedThreshold={40}
                                onEndReached={()=>this.loadMoreForReputation()}
                            />
                        </View>
                        <View tabLabel='完结'>
                            <FlatList
                                initialNumToRender = {20}
                                data={this.state.overDetailList}
                                renderItem={this.renderSortDetailListItem}
                                keyExtractor={(item, index) => index}
                                onEndReachedThreshold={40}
                                onEndReached={()=>this.loadMoreForOver()}
                            />
                        </View>
                    </ScrollableTabView>
                )}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemImage:{
        marginLeft: 14,
        marginRight: 14,
        alignSelf: 'center',
        width: 50,
        height: 75
    }
});

function select(store: any, props: Props) {
    return {
        pressDetailList:store.book.pressDetailList,
        hotDetailList:store.book.hotDetailList,
        newDetailList:store.book.newDetailList,
        reputationDetailList:store.book.reputationDetailList,
        overDetailList:store.book.overDetailList,
        ...props
    };
}

export default connect(select)(BookSortDetail)