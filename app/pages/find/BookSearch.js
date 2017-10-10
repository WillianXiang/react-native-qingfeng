/**
 * Created by WAN on 2017/9/26.
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
    TextInput,
    Alert,
    Keyboard
} from 'react-native'
import { connect } from 'react-redux';
import { Icon,List, ListItem } from 'react-native-elements';

import config from '../../config';
import {getSearchHotWord,getSearchBookList} from '../../actions/book';

class BookSearch extends Component {

    static navigationOptions = {
        title: '搜索',
    };

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
        this.props.dispatch(getSearchHotWord());
    }

    toBookInfo = (bookId) =>{
        const { navigate } = this.props.navigation;
        navigate('BookInfo',bookId);
    };

    toSearchResult = (keyWord) =>{
        if(keyWord == ""){
            Alert.alert(
                '温馨提示：',
                '您输入的搜索内容为空！',
                [
                    {text: '确定', onPress: () => {}},
                ],
                { cancelable: true }
            )
        }else{
            const { navigate } = this.props.navigation;
            navigate('BookSearchResult',{keyWord:keyWord,type:'search'});
            Keyboard.dismiss();
        }
    };

    toggleHotWordVisible = () =>{
        this.setState({hotWordVisible:!this.state.hotWordVisible})
    };

    updateKeyWord = (text) =>{
        this.state.keyWord = text.text;
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

    renderEmptyView = () =>{
        if(typeof(this.props.searchHotWord)!== 'undefined'){
            return(
                this.props.searchHotWord.map((item, index) => {
                    return (
                        <TouchableOpacity key ={"hw-"+index} onPress={()=>this.toSearchResult(item)}>
                            <View style={{padding:5,marginRight:10,backgroundColor:'#1B89EB',marginTop:10}}>
                                <Text style={{color:'#fff'}}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            );
        }
    };

    renderFooter = () =>{
        return(
            <View style={{height:20,justifyContent:'center',alignItems:'center',flexDirection:'row',marginLeft:15,marginRight:15,marginBottom:30}}>
                <View style={{flex:1,height:1/PixelRatio.get(),}}/>
                <Text> 没有更多啦 </Text>
                <View style={{flex:1,height:1/PixelRatio.get(),}}/>
            </View>
        )
    };

    render() {
        if(typeof(this.props.searchHotWord)!== 'undefined'&&!this.state.flatListEmptyUpdated){
            this.state.flatListEmptyUpdated = true;
        }

        return (
            <View style={styles.container}>
                <View>
                    <View style={{height:44,
                        marginLeft:15,
                        marginRight:15,
                        marginTop:10,
                        marginBottom:10,
                        paddingLeft:10,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:'#fff',
                        borderRadius:10,
                        flexDirection:'row'
                    }}>
                        <Icon name='search' color='#1B89EB' iconStyle={{fontSize:30}}/>
                        <TextInput
                            style={{height: 44,flex:1}}
                            placeholder="搜索..."
                            onChangeText={(text) => this.updateKeyWord({text})}
                        />
                        <TouchableOpacity onPress={()=>this.toSearchResult(this.state.keyWord)}>
                            <View style={{height:34,justifyContent:'center',alignItems:'center',backgroundColor:'#1B89EB',padding:3,borderRadius:10,margin:5}}>
                                <Text style={{fontSize:16,color:'#fff'}}> 搜 索 </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'column',marginLeft:15,marginTop:15,marginRight:15}}>
                        <View>
                            <Text style={{fontSize:18}}>热门搜索:</Text>
                        </View>
                        <View style={{flexDirection:'row',alignItems:'flex-start',flexWrap:'wrap',marginTop:10}}>
                            {this.renderEmptyView()}
                        </View>
                    </View>
                </View>
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
        searchHotWord:store.book.searchHotWord,
        searchBookList:store.book.searchBookList,
        ...props
    };
}

export default connect(select)(BookSearch)