/**
 * Created by WAN on 2017/9/8.
 */

import React, { Component } from 'react'
import {
    NetInfo,
    View,
    Image,
    Text,
    StatusBar,
    StyleSheet,
    Platform,
    Button,
    ListView,
    TouchableOpacity,
    FlatList,
    PixelRatio,
    Dimensions,
    BackHandler
} from 'react-native'
import { connect } from 'react-redux';
import {  Icon } from 'react-native-elements';
import Toast from 'react-native-root-toast';

import {getBookShelves,deleteBooksFromShelves,getBooksInfo} from '../../actions/book';

import config from '../../config';
import {dateFormat} from '../../util/formatUtil';
import theme from '../../common/blueTheme';

const SCREEN_WIDTH = Dimensions.get('window').width;
class Follow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            netIsConnected:false,
            bookshelves: [],
            toShow: false,
            focusBook: null,
            mulOperation:false,
            selectedBookIds:[],

            refreshFlatList:1,
        }
    }

    static navigationOptions = {
        tabBarVisible : true//this.props.navigation.state.params.swipeEnabled,
    };

    componentDidMount() {
        this.props.dispatch(getBookShelves());
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
        // this.props.dispatch(getBooksInfo());
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({netIsConnected:isConnected}); }
        );
        NetInfo.isConnected.addEventListener(
            'change',
            this.connectivityChange
        );
    }

    onBackAndroid = () =>{
        if (this.state.mulOperation) {
            this.exitMulOperation();
            return true;
        }
        return false;
    };

    componentWillReceiveProps() {
        //this.props.dispatch(getBookShelves());
    }

    componentWillUnmount(){
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
        NetInfo.isConnected.removeEventListener(
            'change',
            this.connectivityChange
        );
    }

    // renderBookshelves(rowData) {
    //     return (
    //         <TouchableOpacity
    //             activeOpacity={0.5}>
    //             <View style={styles.item}>
    //                 <View>
    //                     <Text >{rowData.bookName}</Text>
    //                     <Text >{
    //                         rowData.lastChapterTime + ' : ' + rowData.lastChapterTitle}
    //                     </Text>
    //                 </View>
    //             </View>
    //         </TouchableOpacity>
    //     )
    // }

    toRead = (bookId) =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            navigate('Read',bookId);
        }else{
            this.netIsNotConnect();
        }
    };

    netIsNotConnect = () =>{
        Toast.show("没有网络连接！",{position:Toast.positions.BOTTOM - 55});
    };

    connectivityChange = (isConnected) => {
        this.setState({netIsConnected:isConnected});
    };

    toMulOperationView = (bookId) =>{
        this.setState({mulOperation:true,refreshFlatList:this.state.refreshFlatList+1});
        // this.props.navigation.dispatch(setParamsAction);
        // this.props.navigation.setParams({tabBarVisible : false});
        // this.setSelectItem(bookId)
    };

    exitMulOperation = () =>{
        this.setState({mulOperation:false,refreshFlatList:this.state.refreshFlatList+1,selectedBookIds:[]});
    };

    setSelectItem = (bookId) =>{
        let hasAdded = this.state.selectedBookIds.some(function( item, index, array ){
            return item === bookId;
        });
        if(hasAdded){
            let index = this.state.selectedBookIds.indexOf(bookId);
            this.state.selectedBookIds.splice(index,1)
        }else{
            this.state.selectedBookIds.push(bookId);
        }
        this.setState({refreshFlatList:this.state.refreshFlatList+1});
    };

    deleteBooksFormShelves = () =>{
        if(this.state.selectedBookIds.length === 0){
            Toast.show("没有选择书籍！", {position: Toast.positions.BOTTOM - 55});
        }else{
            deleteBooksFromShelves(this.state.selectedBookIds);
            this.setState({bookshelves:this.props.bookShelves,selectedBookIds:[]});
        }
    };

    renderBooksItem = (rowData) =>{
        let bookId = rowData.item.bookId;
        let bookUrl = rowData.item.bookUrl;
        let name = rowData.item.bookName;
        let lastChapterTime = rowData.item.lastChapterTime;
        let lastChapterTitle = rowData.item.lastChapterTitle;
        let nowChapterTime = rowData.item.nowChapterTime;
        if(this.state.mulOperation){
            return(
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.setSelectItem(bookId)}
                    style={{width:SCREEN_WIDTH/3,height:(SCREEN_WIDTH/3)*(4/3),elevation:100}}
                >
                    <View style={{paddingTop:5,paddingBottom:5,flex:1,justifyContent:'center',alignItems:'center'}}>
                        <View style={{width:90,height:135,justifyContent:'center',alignItems:'center',position:'relative'}}>
                            <Image
                                style={styles.itemImage}
                                source={bookUrl
                                    ? {uri: (config.IMG_BASE_URL + bookUrl)}
                                    : require('../../res/default.jpg')}
                            />
                            {/*{false?(*/}
                                {/*<View style={{position:'absolute',top:0,justifyContent: 'flex-end',alignItems:'flex-end',flexDirection:'row'}}>*/}
                                    {/*<View style={{flex:1}}/>*/}
                                    {/*<View style={{backgroundColor:'red',padding:1,justifyContent:'center',alignItems:'center'}}>*/}
                                        {/*<Text style={{color:'#fff',fontSize:7,fontWeight:'bold'}}> 更 新 </Text>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*):(null)}*/}
                            <View style={{position:'absolute',bottom:0,justifyContent: 'flex-end',flexDirection:'row'}}>
                                <View style={{flex:1}}/>
                                {this.state.selectedBookIds.some(function( item, index, array ){
                                    return item === bookId;
                                })?(
                                    <View style={{justifyContent:'center',alignItems:'center',width:16,height:16,borderRadius:10,backgroundColor:'#1B89EB',margin:4}}>
                                        <Icon name='check' color='#fff' iconStyle={{fontSize:12}}/>
                                    </View>
                                ):(
                                    <View style={{justifyContent:'center',alignItems:'center',width:16,height:16,borderRadius:10,backgroundColor:'rgba(0,0,0,0.5)',margin:4}}>
                                        <Icon name='check' color='#fff' iconStyle={{fontSize:12}}/>
                                    </View>
                                )}
                            </View>
                        </View>
                        <View style={{justifyContent: 'center',width:90,marginTop:10}}>
                            <Text style={styles.bookTitle} numberOfLines={2} >{name}</Text>
                            {/*<Text style={styles.bookUpdateChapter}>{dateFormat(lastChapterTime)+":"+lastChapterTitle}</Text>*/}
                        </View>
                    </View>
                </TouchableOpacity>
            )
        }else {
            return (
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => this.toRead(bookId)}
                    // onPress={() =>this.props.navigation.setParams({swipeEnabled:false})}
                    onLongPress={() => this.toMulOperationView(bookId)}
                    style={{
                        width: SCREEN_WIDTH / 3,
                        height: (SCREEN_WIDTH / 3) * (4/3),
                    }}
                >
                    <View style={{
                        paddingTop: 5,
                        paddingBottom: 5,
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            width: 90,
                            height: 135,
                            justifyContent: 'center',
                            alignItems: 'center',
                            position: 'relative',
                            borderWidth: 1 / PixelRatio.get(),
                            borderColor: '#000'
                        }}>
                            <Image
                                style={styles.itemImage}
                                source={bookUrl
                                    ? {uri: (config.IMG_BASE_URL + bookUrl)}
                                    : require('../../res/default.jpg')}
                            />
                            {/*{false?(*/}
                                {/*<View style={{*/}
                                    {/*position: 'absolute',*/}
                                    {/*top: 0,*/}
                                    {/*justifyContent: 'flex-end',*/}
                                    {/*alignItems: 'flex-end',*/}
                                    {/*flexDirection: 'row'*/}
                                {/*}}>*/}
                                    {/*<View style={{flex: 1}}/>*/}
                                    {/*<View style={{*/}
                                        {/*backgroundColor: 'red',*/}
                                        {/*padding: 1,*/}
                                        {/*justifyContent: 'center',*/}
                                        {/*alignItems: 'center'*/}
                                    {/*}}>*/}
                                        {/*<Text style={{color: '#fff', fontSize: 7, fontWeight: 'bold'}}> 更 新 </Text>*/}
                                    {/*</View>*/}
                                {/*</View>*/}
                            {/*):(null)}*/}
                        </View>
                        <View style={{justifyContent: 'flex-start', width: 90, marginTop: 10,height:30,}}>
                            <Text style={styles.bookTitle} numberOfLines={2}>{name}</Text>
                            {/*<Text style={styles.bookUpdateChapter}>{dateFormat(lastChapterTime)+":"+lastChapterTitle}</Text>*/}
                        </View>
                    </View>
                </TouchableOpacity>

            )
        }

    };

    renderFooterView = () =>{
        if(this.state.bookshelves.length === 0){
            return(
                <View style={{flexDirection:'row',paddingTop:50,paddingBottom:5}}>
                    <View style={[styles.itemContent,{alignItems:'center'}]}>
                        <Text style={styles.bookTitle}>书架现在是空的</Text>
                    </View>
                </View>
            )
        }else{
            return(
                <View style={{height:100,justifyContent:'center',alignItems:'center',flexDirection:'row',marginLeft:30,marginRight:30,marginBottom:30}}>
                    <View style={{flex:1,height:1/PixelRatio.get(),backgroundColor:theme.css.color.line,}}/>
                    <Text>  书架中有{this.state.bookshelves.length}本书  </Text>
                    <View style={{flex:1,height:1/PixelRatio.get(),backgroundColor:theme.css.color.line,}}/>
                </View>
            )
        }
    };

    render() {
        if(typeof(this.props.bookShelves)!== 'undefined'){
            this.state.bookshelves = this.props.bookShelves
        }
        return (
            <View style={[styles.container,{position:'relative'}]}>
                <FlatList
                    // ItemSeparatorComponent = {this.renderSeparatorView}
                    initialNumToRender = {10}
                    data={this.state.bookshelves}
                    numColumns={3}
                    ListFooterComponent = {() => this.renderFooterView()}
                    renderItem={this.renderBooksItem}
                    keyExtractor={(item, index) => index}
                    extraData={this.state.refreshFlatList}
                />
                {this.state.mulOperation?(
                    <TouchableOpacity
                        onPress={()=>this.exitMulOperation()}
                        style={{
                            position:'absolute',
                            top:0,
                            right:0,
                            padding:10,
                            flexDirection:'row',
                            elevation:100,
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                        <Icon raised reverse name='clear' color='#1B89EB' iconStyle={{fontSize:30}}/>
                    </TouchableOpacity>
                ):(null)}
                {this.state.mulOperation?(
                    <View
                        style={{
                            position:'absolute',
                            bottom:0,
                            height:50,
                            backgroundColor:'#fff',
                            flexDirection:'row',
                            width:SCREEN_WIDTH,
                            borderTopWidth:1 / PixelRatio.get(),
                            borderColor: '#0F0F11',
                            elevation:100
                        }}>
                        {/*<TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>*/}
                            {/*<Text style={{fontSize:16,color:'#1B89EB'}}>移 动</Text>*/}
                        {/*</TouchableOpacity>*/}
                        {/*<TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center'}}>*/}
                            {/*<Text style={{fontSize:16,color:'#1B89EB'}}>缓 存</Text>*/}
                        {/*</TouchableOpacity>*/}
                        <TouchableOpacity
                            onPress={()=>this.deleteBooksFormShelves()}
                            style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:16,color:'red'}}>删 除</Text>
                        </TouchableOpacity>
                    </View>
                ):(null)}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:theme.css.color.white,
        paddingTop:20
    },
    headerIcon: {
        marginLeft: 14,
        marginRight: 14
    },
    itemImage: {
        marginLeft: 14,
        marginRight: 14,
        alignSelf: 'center',
        width: 90,
        height: 135
    },
    itemContent:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    bookTitle:{
        fontSize:12,
        color: theme.css.fontColor.title,
        marginBottom: 3
    },
    bookUpdateChapter:{
        fontSize: theme.css.fontSize.desc,
        color: theme.css.fontColor.desc,
        marginTop: 3
    },
});


function select(store: any, props: Props) {
    return {
        bookShelves:store.book.bookShelves,
        ...props
    };
}

export default connect(select)(Follow);