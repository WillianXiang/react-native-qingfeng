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
    FlatList,
    Dimensions,
    TouchableOpacity,
    PixelRatio
} from 'react-native'
import { connect } from 'react-redux';
import {  Button,ListItem } from 'react-native-elements';
import config from '../../config';
import {getBookDetail,getBookShelves} from '../../actions/book';
import {saveBookToRealm,deleteBookToRealm,hasSaveBook} from '../../components/BookHandler';
import {dateFormat,wordCountFormat} from '../../util/formatUtil';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class BookInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            headerTitle:'',
            bookIntroVisible:false,
        }
    }

    static navigationOptions = {
        title: '书籍详情',//typeof(this.state.headerTitle)!== 'undefined'?this.state.headerTitle:''
    };

    componentWillMount(){
        const bookId = this.props.navigation.state.params;
        this.props.dispatch(getBookDetail(bookId));
    }

    toBookSearchResult = (keyWord,type) =>{
        const { navigate } = this.props.navigation;
        navigate('BookSearchResult',{keyWord:keyWord,type:type});
    };

    addOrDeleteToBookshelf = (bookInfo) =>{
        let hasSaved = hasSaveBook(bookInfo._id);
        if(hasSaved){
            deleteBookToRealm(bookInfo);
        }else{
            saveBookToRealm(bookInfo);
        }
        this.props.dispatch(getBookShelves());
        this.setState({buttonChange:hasSaved})
    };

    toRead = (bookInfo) =>{
        const { navigate } = this.props.navigation;
        navigate('Read',bookInfo._id);
    };

    toggleBookIntro = () =>{
       this.setState({bookIntroVisible:!this.state.bookIntroVisible})
    };

    renderTags = (tags) =>{
        if(typeof(tags) !== 'undefined'){
            return(
                tags.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key ={"tag-"+index}
                            onPress={()=>this.toBookSearchResult(item,'tag')}>
                            <View style={{padding:5,marginRight:10,backgroundColor:'#1B89EB',marginTop:5,marginBottom:5}}>
                                <Text style={{color:'#fff'}}>{item}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })
            );
        }
    };

    renderBookInfo = () =>{
        let bookInfo = this.props.bookDetail;
        let coverUrl = bookInfo.cover;
        return(
            <View style={{padding:15}}>
                <View style={{flexDirection:'row',paddingTop:5,paddingBottom:5,alignItems:'center'}}>
                    <View style={{flexDirection:'row',width:60,height:90,justifyContent:'center',alignItems:'center',backgroundColor:'#fff'}}>
                        <Image
                            style={styles.itemImage}
                            source={coverUrl
                                ? {uri: (config.IMG_BASE_URL + coverUrl)}
                                : require('../../res/default.jpg')}
                        />
                    </View>
                    <View  style={{flexDirection:'column',marginLeft:10}}>
                        <Text style={{fontSize:18,color:'#000',flex:1}} numberOfLines={1}>{bookInfo.title}</Text>
                        <Text style={{flex:1}}><Text style={{color:'#1B89EB'}} onPress={()=>this.toBookSearchResult(bookInfo.author,'author')}>{bookInfo.author}</Text> | {bookInfo.minorCate} | {wordCountFormat(bookInfo.wordCount)}</Text>
                        <Text style={{flex:1}}>更新时间：{dateFormat(bookInfo.updated)}</Text>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',paddingTop:5,paddingBottom:10}}>
                    {typeof(bookInfo._id) !== 'undefined' && hasSaveBook(bookInfo._id)?(
                        <Button title="不追了" onPress={()=>{this.addOrDeleteToBookshelf(bookInfo)}}  buttonStyle={{width:(SCREEN_WIDTH-40)/2.2,height:30}}/>
                    ):(
                        <Button title="追更新" onPress={()=>{this.addOrDeleteToBookshelf(bookInfo)}} backgroundColor='#1B89EB'  buttonStyle={{width:(SCREEN_WIDTH-40)/2.2,height:30}}/>
                    )}
                    <Button  title="开始阅读" onPress={()=>{this.toRead(bookInfo)}} backgroundColor='#1B89EB' buttonStyle={{width:(SCREEN_WIDTH-40)/2.2,height:30}}/>
                </View>
                <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10,borderTopWidth:1/PixelRatio.get(),borderBottomWidth:1/PixelRatio.get(),borderColor:'#000'}}>
                    <View style={{flex:1}}>
                        <Text style={{textAlign:'center'}}>追书人数</Text>
                        <Text style={{textAlign:'center'}}>{bookInfo.latelyFollower}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{textAlign:'center'}}>读者留存率</Text>
                        <Text style={{textAlign:'center'}}>{bookInfo.retentionRatio}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={{textAlign:'center'}}>日更新字数</Text>
                        <Text style={{textAlign:'center'}}>{bookInfo.serializeWordCount}</Text>
                    </View>
                </View>
                {bookInfo.tags&&bookInfo.tags.length>0?(
                    <View style={{flexDirection:'row',paddingTop:10,paddingBottom:10,borderBottomWidth:1/PixelRatio.get(),borderColor:'#000',flexWrap:'wrap'}}>
                        {this.renderTags(bookInfo.tags)}
                    </View>
                ):(null)}
                <View style={{paddingTop:10,paddingBottom:10}}>
                    {this.state.bookIntroVisible?(
                        <Text onPress={()=>this.toggleBookIntro()}>
                            {bookInfo.longIntro}
                        </Text>
                    ):(
                        <Text onPress={()=>this.toggleBookIntro()}>
                            {bookInfo.longIntro}
                        </Text>
                    )}
                </View>
            </View>
        )
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent={false} backgroundColor="#1B89EB"  barStyle='light-content'/>
                <View>
                    {this.renderBookInfo()}
                </View>
                {/*<View>*/}
                    {/*<Text>热门书评</Text>*/}
                {/*</View>*/}
                {/*<View>*/}
                    {/*<Text>书籍社区</Text>*/}
                {/*</View>*/}
                {/*<View>*/}
                    {/*<Text>推荐书单</Text>*/}
                {/*</View>*/}
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
        width: 60,
        height: 90
    },
});


function select(store: any, props: Props) {
    return {
        bookDetail:store.book.bookDetail,
        ...props
    };
}

export default connect(select)(BookInfo)