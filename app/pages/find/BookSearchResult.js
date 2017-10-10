/**
 * Created by WAN on 2017/9/27.
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
    TouchableOpacity,
    PixelRatio,
    TextInput
} from 'react-native'
import { connect } from 'react-redux';
import { Icon,List, ListItem } from 'react-native-elements';

import config from '../../config';
import {getSearchBookListForKeyWord,getSearchBookListForAuthor,getSearchBookListForTag} from '../../actions/book';

import Loading from '../../components/Loading';

class BookSearchResult extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.keyWord}`,
    });

    constructor(props) {
        super(props);
        this.state = {
            bookList:[],
            searchHotWord:[],
            pageNum:1,
            flatListUpdate:1,
            flatListEmptyUpdated:false,
            hotWordVisible:true,
            keyWord:'',
        }
    }

    componentWillMount(){
        if(this.props.navigation.state.params.type === 'search'){
            this.props.dispatch(getSearchBookListForKeyWord(this.props.navigation.state.params.keyWord));
        }else if(this.props.navigation.state.params.type === 'author'){
            this.props.dispatch(getSearchBookListForAuthor(this.props.navigation.state.params.keyWord));
        }else if(this.props.navigation.state.params.type === 'tag'){
            this.props.dispatch(getSearchBookListForTag(this.props.navigation.state.params.keyWord));
        }
    }

    loadMore(){
        this.state.pageNum+= 1;
        if(this.props.navigation.state.params.type === 'search'){
            this.props.dispatch(getSearchBookListForKeyWord(this.props.navigation.state.params.keyWord,this.state.pageNum));
        }else if(this.props.navigation.state.params.type === 'author'){
            this.props.dispatch(getSearchBookListForAuthor(this.props.navigation.state.params.keyWord,this.state.pageNum));
        }else if(this.props.navigation.state.params.type === 'tag'){
            this.props.dispatch(getSearchBookListForTag(this.props.navigation.state.params.keyWord,this.state.pageNum));
        }
    }

    toBookInfo = (bookId) =>{
        const { navigate } = this.props.navigation;
        navigate('BookInfo',bookId);
    };


    renderBookListItem = (rowData) =>{
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

    renderFooter = () =>{
        return(
            <View style={{height:20,justifyContent:'center',alignItems:'center',flexDirection:'row',marginLeft:15,marginRight:15,marginBottom:30,marginTop:20}}>
                <View style={{flex:1,height:1/PixelRatio.get(),}}/>
                {this.props.loadBookState?(
                    <Text> 正在加载中 </Text>
                ):(
                    <Text> 没有更多啦 </Text>
                )}
                <View style={{flex:1,height:1/PixelRatio.get(),}}/>
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                {this.props.loadBookState&&this.state.pageNum === 1?(
                    <Loading/>
                ):(
                    <FlatList
                    initialNumToRender = {20}
                    data={this.props.searchBookList?this.props.searchBookList:this.state.bookList}
                    renderItem={this.renderBookListItem}
                    ListFooterComponent={()=>this.renderFooter()}
                    keyExtractor={(item, index) => index}
                    getItemLayout={(data,index)=>(
                        {length: 100, offset: (100) * index, index}
                    )}
                    onEndReachedThreshold={100}
                    onEndReached={()=>this.loadMore()}
                    />
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
        loadBookState:store.book.loadBookState,
        searchBookList:store.book.searchBookList,
        ...props
    };
}

export default connect(select)(BookSearchResult)