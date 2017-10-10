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

import config from '../../config';
import {getBookList} from '../../actions/book';

class BookGroup extends Component {

    static navigationOptions = {
        title: '推荐专题',
    };

    constructor(props) {
        super(props);
        this.state = {
            bookLists:[],
            pageNumber:1,
        }
    }

    componentWillMount(){
        this.props.dispatch(getBookList(0));
    }

    toBookGroupDetail = (id,title) =>{
        const { navigate } = this.props.navigation;
        navigate('BookGroupDetail',{bookListId:id,bookListTitle:title});
    };

    renderBookListItem = (rowData) =>{
        let id = rowData.item._id;
        let title = rowData.item.title;
        let desc = rowData.item.desc;
        let cover = rowData.item.cover;
        let bookCount = rowData.item.bookCount;
        return (
            <TouchableOpacity
                onPress={()=>this.toBookGroupDetail(id,title)}
                style={{justifyContent:'center',alignItems:'center',flexDirection:'row',backgroundColor:'#fff',marginTop:10,marginLeft:15,marginRight:15,borderRadius:10,overflow:'hidden'}}>
                <Image
                    style={styles.itemImage}
                    source={cover
                        ? {uri: (config.IMG_BASE_URL + cover)}
                        : require('../../res/default.jpg')}
                />
                <View style={{flex:1,flexDirection:'column',marginRight:14}}>
                    <Text style={{fontSize:18,color:'#000'}} numberOfLines={1}>{title}</Text>
                    <Text style={{marginTop:10}}>{desc}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    loadMore = () => {
        this.state.pageNumber += 1;
        this.props.dispatch(getBookList(this.state.pageNumber));
    };

    render() {
        const { navigate } = this.props.navigation;
        if(typeof(this.props.bookLists)!== 'undefined') this.state.bookLists = this.props.bookLists;
        return (
            <View style={styles.container}>
                <FlatList
                    initialNumToRender = {20}
                    data={this.state.bookLists}
                    renderItem={this.renderBookListItem}
                    keyExtractor={(item, index) => index}
                    onEndReachedThreshold={40}
                    onEndReached={()=>this.loadMore()}
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
        width: 100,
        height: 150
    }
});


function select(store: any, props: Props) {
    return {
        bookLists:store.book.bookLists,
        ...props
    };
}

export default connect(select)(BookGroup)