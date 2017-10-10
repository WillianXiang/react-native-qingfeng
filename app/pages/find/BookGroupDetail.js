/**
 * Created by WAN on 2017/9/25.
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
    PixelRatio,
    TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux';

import config from '../../config';
import {getBookListDetail} from '../../actions/book';
import {dateFormat,wordCountFormat} from '../../util/formatUtil';

class BookGroupDetail extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: `${navigation.state.params.bookListTitle}`,
    });

    constructor(props) {
        super(props);
        this.state = {
            bookList:[],
            bookListTitle:'',
            bookListDesc:'',
        }
    }

    componentWillMount(){
        this.props.dispatch(getBookListDetail(this.props.navigation.state.params.bookListId));
    }

    toBookInfo = (bookId) =>{
        const { navigate } = this.props.navigation;
        navigate('BookInfo',bookId);
    };

    renderBookListItem = (rowData) =>{
        let id = rowData.item.book._id;
        let title = rowData.item.book.title;
        let author = rowData.item.book.author;
        let longIntro = rowData.item.book.longIntro;
        let cover = rowData.item.book.cover;
        let latelyFollower = rowData.item.book.latelyFollower;
        let wordCount = rowData.item.book.wordCount;
        let comment = rowData.item.comment;
        return (
            <TouchableOpacity
                onPress={()=>this.toBookInfo(id)}
                style={{justifyContent:'center',alignItems:'center',marginTop:10,marginLeft:15,marginRight:15,padding:10,borderRadius:10,backgroundColor:'#fff'}}>
                <View style={{flexDirection:'row',borderBottomWidth:1/PixelRatio.get(),borderColor:'#000',paddingBottom:10}}>
                    <Image
                        style={styles.itemImage}
                        source={cover
                            ? {uri: (config.IMG_BASE_URL + cover)}
                            : require('../../res/default.jpg')}
                    />
                    <View style={{flex:1}}>
                        <Text style={{fontSize:18,color:'#000'}}>{title}</Text>
                        <Text>{author}</Text>
                        <Text>{latelyFollower}在追 | {wordCountFormat(wordCount)}</Text>
                    </View>
                </View>

                <View style={{flexDirection:'column'}}>
                    <Text style={{marginTop:10,marginBottom:10}}>{longIntro}</Text>
                </View>
                {comment == ''?(null):(
                    <View style={{borderTopWidth:1/PixelRatio.get(),borderColor:'#000',left:0,right:0,minHeight:10}}>
                        <Text style={{marginTop:10}}><Text style={{color:'#000'}}>评价：</Text><Text style={{fontStyle: 'italic'}}>{comment}</Text></Text>
                    </View>
                )}
            </TouchableOpacity>
        )
    };

    renderHeader = () => {
        return (
            <View style={{flexDirection: 'column', paddingBottom: 15,paddingLeft:15,backgroundColor:'#fff'}}>
                <Text style={{fontSize: 18,color:'#000'}}>{this.state.bookListTitle}</Text>
                <Text>{this.state.bookListDesc}</Text>
            </View>
        )
    };

    loadMore = () => {
        this.state.pageNumber += 1;
        this.props.dispatch(getBookList(this.state.pageNumber));
    };

    render() {
        if(typeof(this.props.bookList)!== 'undefined'){
            this.state.bookList = this.props.bookList.books;
            this.state.bookListTitle = this.props.bookList.title;
            this.state.bookListDesc = this.props.bookList.desc
        }
        return (
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent = {this.renderHeader}
                    initialNumToRender = {20}
                    data={this.state.bookList}
                    renderItem={this.renderBookListItem}
                    keyExtractor={(item, index) => index}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemImage:{
        marginRight: 14,
        alignSelf: 'center',
        width: 50,
        height: 75
    }
});


function select(store: any, props: Props) {
    return {
        bookList:store.book.bookList,
        ...props
    };
}

export default connect(select)(BookGroupDetail)