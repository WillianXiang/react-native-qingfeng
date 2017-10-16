/**
 * Created by WAN on 2017/9/12.
 */
import React, { Component } from 'react'
import {
    PanResponder,
    View,
    Image,
    Text,
    StatusBar,
    StyleSheet,
    Platform,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback,
    Alert,
    Animated,
    PixelRatio,
    InteractionManager,
} from 'react-native'
import { connect } from 'react-redux';
import {  Button ,Icon,ListItem } from 'react-native-elements';
import Toast from 'react-native-root-toast';

import config from '../../config';
import {getBookDetail,getBookShelves} from '../../actions/book';
import {getBookChapters,getBookChapterDetail,restoreRequestInvalidState} from '../../actions/read';
import {saveBookToRealm,saveChapterRecordById,hasSaveBook,saveSettingToRealm} from '../../components/BookHandler';
import Loading from '../../components/Loading';
import theme from '../../common/blueTheme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Read extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chaptersModalVisible:false,
            bookId:'',
            bookTitle:'',
            bookChaptersCount:0,
            currentChapterIndex:-1,
            chapters:[],
            chaptersUrl:[],
            chapterTitle:'',
            bottomMenuVisible:false,
            fontSizeMenuVisible:false,
            isDay:true,
            backgroundColor:'#EBEAEF',
            textColor:'#000000',
            menuBackGroundColor:'#ffffff',
            barStyle:'dark-content',
            textFontSize:18,
            sourceInvalid:true,
            buttonDisabled:false,
            //night bd #1D1C21 text #888888 menu #101317
            //white bd #F8F7FC text #000000 menu #ffffff
            //pagination
            shouldPagination:false,
            onePageText:'',
            currentParagraphIndex:0,
            //animate
            animateChapterWidth:new Animated.Value(0),
            animateChapterShadowWidth:new Animated.Value(0),
            animateChapterVisible:false,
            animateBottomMenuHeight:new Animated.Value(0),
            animateTopMenuHeight:new Animated.Value(0),
            animateFontSizeMenuHeight:new Animated.Value(0),
        }
    }

    static navigationOptions = {
        title: '内容详情',//typeof(this.state.headerTitle)!== 'undefined'?this.state.headerTitle:''
    };

    componentWillMount(){
        this.state.bookId = this.props.navigation.state.params;
        this.props.dispatch(getBookChapters(this.state.bookId));
        this.props.dispatch(getBookDetail(this.state.bookId));
    }

    componentDidMount(){
        //如果有记录，获取记录的章节的信息
        let book = realm.objectForPrimaryKey('HistoryBook', this.state.bookId);
        if(book && book.historyChapterUrl!== ''){
            let chapterUrl = book.historyChapterUrl;
            this.state.currentChapterIndex = book.historyChapterNum;
            this.state.chapterTitle = book.historyChapterTitle;
            this.getChapterDetail(chapterUrl);
        }
        let setting = realm.objectForPrimaryKey('SystemSetting', 1);
        if(setting){
            if(setting.readTheme === 'night'){
                this.state.isDay = false;
                // this.setState({isDay:false});
                this.toggleDayNight();
            }
            if(setting.readTextSize !== 0){
                this.state.textFontSize = setting.readTextSize;
                // this.setState({textFontSize:setting.readTextSize});
            }
        }
    }

    componentWillUnmount(){
        // this.props.chapter = undefined;
        // this.props.mixTocChapters = undefined;
        if(hasSaveBook(this.state.bookId)&&this.state.sourceInvalid){
            this.props.dispatch(getBookShelves());
        }
        if(this.state.isDay ===true){
            saveSettingToRealm({readTheme:'day'})
        }else{
            saveSettingToRealm({readTheme:'night'})
        }
        if(this.state.textFontSize !== 0){
            saveSettingToRealm({readTextSize:this.state.textFontSize})
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.chaptersSourceInvalid){
            this.toBackPage();
            this.props.dispatch(restoreRequestInvalidState());
            this.state.sourceInvalid = false;
        }
        if(nextProps.mixTocChapters.length>0 && this.state.chapters.length === 0){
            this.state.chapters = nextProps.mixTocChapters;
            this.state.chapters.map((item,index) =>{
                this.state.chaptersUrl.push(item.link);
            } );
        }
        if(this.state.currentChapterIndex === -1 && nextProps.mixTocChapters.length>0){
            let chapterUrl = nextProps.mixTocChapters[0].link;
            this.getChapterDetail(chapterUrl);
        }
        if(this.props.chapter.body&&!nextProps.loadReadState){
            this.refs.scrollView.scrollTo({y: 0});
        }
        this.state.buttonDisabled = nextProps.loadReadState;
        if(hasSaveBook(this.state.bookId)&&this.state.sourceInvalid&&this.props.chapter.body&&this.state.chapters.length>0){
            if(this.state.currentChapterIndex<0) this.state.currentChapterIndex = 0;
            saveChapterRecordById(this.state.bookId,this.state.currentChapterIndex,this.state.chapters[this.state.currentChapterIndex].link,this.state.chapters[this.state.currentChapterIndex].title);
        }
    }

    _formatContent = (content) =>{
        let _content = '\u3000\u3000' + content.trim().replace(/\n/g, '\n\u3000\u3000');

            const length = _content.length;
            var array = [];
            let x = 0,y,m = 0;
            while (x < length) {
                let _array = [];
                for (let i = 0; i <= 16; i++) {
                    let str_spa = _content.substring(x, x + 1);
                    let str_sto = _content.substring(x, x + 18);
                    const re = /^\s+$/
                    if (str_sto.indexOf('”') != -1) {
                        y = x + str_sto.indexOf('”') + 1;
                        _array[i] = _content.substring(x, y);
                        x = y;
                        continue;
                    }
                    else if (str_sto.indexOf('。') != -1 ) {
                        y = x + str_sto.indexOf('。') + 1;
                        if (re.exec(_content.substring(y, y + 1))) {
                            y = x + str_sto.indexOf('。') + 1;
                            _array[i] = _content.substring(x, y);
                            x = y;
                            continue;
                        }
                        else {
                            if (str_sto.indexOf('！') != -1) {
                                y = x + str_sto.indexOf('！') + 1;
                                _array[i] = _content.substring(x, y);
                                x = y;
                                continue;
                            }
                            else {
                                y = x + 18;
                                _array[i] = _content.substring(x, y);
                                x = y;
                                continue;
                            }
                        }
                    }
                    else if (str_sto.indexOf('！') != -1) {
                        y = x + str_sto.indexOf('！') + 1;
                        if (re.exec(_content.substring(y, y + 1))) {
                            y = x + str_sto.indexOf('！') + 1;
                            _array[i] = _content.substring(x, y);
                            x = y;
                            continue;
                        }
                        else {
                            y = x + 18;
                            _array[i] = _content.substring(x, y);
                            x = y;
                            continue;
                        }
                    }
                    else if (str_sto.indexOf('？') != -1){
                        y = x + str_sto.indexOf('？') + 1;
                        if (re.exec(_content.substring(y, y + 1))) {
                            y = x + str_sto.indexOf('？') + 1;
                            _array[i] = _content.substring(x, y);
                            x = y;
                            continue;
                        }
                        else {
                            y = x + 18;
                            _array[i] = _content.substring(x, y);
                            x = y;
                            continue;
                        }
                    }
                    else if (re.exec(str_spa)) {
                        y = x + 24;
                        if (_content.substring(x,y).indexOf('。') != -1) {
                            y = x + _content.substring(x,y).indexOf('。') + 1;
                            _array[i] = _content.substring(x, y);
                            x = y;
                            continue
                        }
                        _array[i] = _content.substring(x, y);
                        x = y;
                        continue;
                    }
                    else {
                        y = x + 18
                        _array[i] = _content.substring(x, y);
                        x = y;
                    }
                }
                array[m] = _array;
                m++
            }
            // console.log((m - 1) * 375);
            // return array
        return (
            array.map((rowData,index)=>{
                return (
                    rowData
                );
            })
        );

    };

    handleScroll(e) {

    }

    toBackPage = () =>{
        this.props.navigation.goBack();
    };

    toBookInfo = () =>{
        const { navigate } = this.props.navigation;
        navigate('BookInfo',this.state.bookId);
    };

    getChapterDetail = (chapterUrl) =>{
        if(this.state.chapters.length>0){
            this.state.currentChapterIndex = this.state.chaptersUrl.indexOf(chapterUrl);
            this.state.chapterTitle = this.state.chapters[this.state.currentChapterIndex].title;
        }
        if(typeof(this.refs.scrollView)!== 'undefined'){
            this.refs.scrollView.scrollTo({y: 0});
        }
        this.props.dispatch(getBookChapterDetail(chapterUrl));
    };

    toLastChapter = () =>{
        if(this.state.currentChapterIndex-1>=0){
            this.getChapterDetail(this.state.chaptersUrl[this.state.currentChapterIndex-1]);
        }else{
            Toast.show("已经是第一章了！",{position:Toast.positions.BOTTOM - 55});
        }
    };

    toNextChapter = () =>{
        if(this.state.currentChapterIndex+1<this.state.chaptersUrl.length){
            this.getChapterDetail(this.state.chaptersUrl[this.state.currentChapterIndex+1]);
        }else{
            Toast.show("已经是最新一章了！",{position:Toast.positions.BOTTOM - 55});
        }
    };

    toggleDayNight = () =>{
        if(this.state.isDay){
            this.setState({
                backgroundColor:theme.css.readForNight.backgroundColor,
                textColor:theme.css.readForNight.textColor,
                menuBackGroundColor:theme.css.readForNight.menuBackgroundColor,
                barStyle:'light-content',
                isDay:!this.state.isDay})
        }else{
            this.setState({
                backgroundColor:theme.css.readForWhite.backgroundColor,
                textColor:theme.css.readForWhite.textColor,
                menuBackGroundColor:theme.css.readForWhite.menuBackgroundColor,
                barStyle:'dark-content',
                isDay:!this.state.isDay})
        }
    };

    toggleFontSizeMenuVisible = () =>{
        if(this.state.fontSizeMenuVisible){
            this.closeFontSizeMenu();
        }else{
            this.openFontSizeMenu();
        }
        this.state.fontSizeMenuVisible = !this.state.fontSizeMenuVisible;
    };

    inFontSize = () =>{
        this.setState({textFontSize:this.state.textFontSize+2})
    };

    deFontSize = () =>{
        this.setState({textFontSize:this.state.textFontSize-2})
    };

    renderChapter = () =>{
            // let chapter = this.props.chapter;
            // if(typeof(chapter.body) !== 'undefined'){
            //     const content = this._formatContent(chapter.body);
                return(
                    <View style={{flex:1,paddingTop:0,paddingBottom:0,backgroundColor:this.state.backgroundColor}}>
                        {this.props.chapter.body?(
                            <ScrollView
                                ref='scrollView'
                                scrollEventThrottle={800}
                                horizontal={false}
                                onScroll={(e)=>this.handleScroll(e)}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                pagingEnabled={true}
                            >
                                <TouchableWithoutFeedback
                                    onPress={()=>{this.toggleBottomMenuVisible()}}>
                                    <View style={{flex:1}}>
                                        <Text style={{color:this.state.textColor,marginLeft:15,marginRight:10}}>{this.state.chapterTitle}</Text>
                                        {this.props.loadReadState?(
                                            <Loading/>
                                        ):(
                                            <Text style={{fontSize:this.state.textFontSize,color:this.state.textColor,lineHeight:this.state.textFontSize+22,marginLeft:15,marginRight:10}}>
                                                {this._formatContent(this.props.chapter.body)}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={{flexDirection:'row',marginTop:10,marginBottom:10,justifyContent:'center'}}>
                                    <Button title="上一章" disabled={this.state.buttonDisabled} onPress={()=>{this.toLastChapter()}} buttonStyle={{width:(SCREEN_WIDTH-40)/2.2,height:44}}/>
                                    <Button title="下一章" disabled={this.state.buttonDisabled} onPress={()=>{this.toNextChapter()}} buttonStyle={{width:(SCREEN_WIDTH-40)/2.2,height:44}}/>
                                </View>
                            </ScrollView>
                        ):(
                            <View style={{flex:1,paddingTop:0,paddingBottom:0,backgroundColor:this.state.backgroundColor,justifyContent:'center',alignItems:'center'}}>
                                <Loading/>
                            </View>
                        )}
                    </View>
                )
            // }
    };

    selectOneChapter = (chapterUrl,title) =>{
        this.getChapterDetail(chapterUrl);
        this.hideChapter();
        this.setState({chaptersModalVisible:false});
    };

    renderChaptersListItem = (rowData) =>{
        let title = rowData.item.title;
        let link = rowData.item.link;
        let index = rowData.index;
        return(
            <TouchableOpacity
                onPress={()=>this.selectOneChapter(link,title)}
                style={{
                    backgroundColor:this.state.menuBackGroundColor,
                    height:50,
                    flexDirection:'row',
                    marginRight:15,
                    marginLeft:20,
                    alignItems:'center'
                }}>
                <Icon name='place' color='#000' iconStyle={{fontSize:12}}/>
                {index === this.state.currentChapterIndex?(
                    <Text style={{color:'#1B89EB',marginLeft:10,marginRight:10,fontSize:14}} numberOfLines={1}>{title}</Text>
                ):(
                    <Text style={{color:this.state.textColor,marginLeft:10,marginRight:10,fontSize:14}} numberOfLines={1}>{title}</Text>
                )}
            </TouchableOpacity>
        )
    };

    toggleBottomMenuVisible = () =>{
        if(this.state.bottomMenuVisible){
            this.hideBottomMenu();
        }else{
            this.showBottomMenu();
        }
    };

    renderSeparatorView = () =>{
        return(
            <View
                style={{
                    height:1/PixelRatio.get(),
                    marginRight:20,
                    marginLeft:20,
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'#000'
                }}>
            </View>
        )
    };

    showChapter = () =>{
        this.hideBottomMenu();
        this.state.animateChapterWidth.setValue(0);
        this.state.animateChapterShadowWidth.setValue(0);
        if(!this.state.animateChapterVisible){
            this.state.animateChapterVisible = true;
            setTimeout(() => {
                this.setState({animateChapterVisible:true});
            }, 10);
            Animated.parallel([
                Animated.timing(this.state.animateChapterWidth,{toValue:SCREEN_WIDTH*0.75,duration:100}),
                Animated.timing(this.state.animateChapterShadowWidth,{toValue:SCREEN_WIDTH,duration:100}),
            ]).start();
        }
        // setTimeout(() => {
        //     this.refs.chaptersFlatList.scrollToOffset({animated: true, offset: this.state.currentChapterIndex*50})
        // }, 3000);
        setTimeout(() => {
            this.refs.chaptersFlatList.scrollToIndex({
                animated: true,
                index: this.state.currentChapterIndex,
                viewOffset: 0.5,
                viewPosition: 0.5,
            });
        }, 1000);
    };

    showBottomMenu = () =>{
        this.state.animateBottomMenuHeight.setValue(0);
        this.state.animateTopMenuHeight.setValue(0);
        if(!this.state.bottomMenuVisible){
            this.state.bottomMenuVisible = true;
            Animated.parallel([
                Animated.timing(this.state.animateBottomMenuHeight,{toValue:50,duration:100}),
                Animated.timing(this.state.animateTopMenuHeight,{toValue:56,duration:100}),
            ]).start();
            setTimeout(() => {
                this.setState({bottomMenuVisible:true})
            }, 100);
        }
    };

    openFontSizeMenu = () =>{
        this.state.animateFontSizeMenuHeight.setValue(0);
        if(!this.state.fontSizeMenuVisible){
            this.setState({animateChapterVisible:true});
            Animated.parallel([
                Animated.timing(this.state.animateFontSizeMenuHeight,{toValue:50,duration:100}),
            ]).start();
        }
    };

    hideChapter = () =>{
        if(this.state.animateChapterVisible){
            this.state.animateChapterVisible = false;
            this.setState({animateChapterVisible:false});
            Animated.parallel([
                Animated.timing(this.state.animateChapterWidth,{toValue:0,duration:100}),
                Animated.timing(this.state.animateChapterShadowWidth,{toValue:0,duration:100}),
            ]).start();
        }
    };

    hideBottomMenu = () =>{
        if(this.state.bottomMenuVisible){
            this.state.bottomMenuVisible = false;
            Animated.parallel([
                Animated.timing(this.state.animateBottomMenuHeight,{toValue:0,duration:100}),
                Animated.timing(this.state.animateTopMenuHeight,{toValue:0,duration:100}),
            ]).start();
            setTimeout(() => {
                this.setState({bottomMenuVisible:false})
            }, 100);
            this.closeFontSizeMenu();
        }
    };

    closeFontSizeMenu = () =>{
        if(this.state.fontSizeMenuVisible){
            this.setState({animateChapterVisible:false});
            Animated.parallel([
                Animated.timing(this.state.animateFontSizeMenuHeight,{toValue:0,duration:100}),
            ]).start();
        }
    };

    changeChapterDir = () =>{
        this.props.mixTocChapters.reverse();
        this.setState({chapters:[],chaptersUrl:[],currentChapterIndex:this.props.mixTocChapters.length-1-this.state.currentChapterIndex});
    };

    render() {
        return (
            <View style={styles.container}>
                <StatusBar translucent={false} animated={true} barStyle={this.state.barStyle} backgroundColor={this.state.menuBackGroundColor} hidden={!this.state.bottomMenuVisible}/>
                {this.renderChapter()}
                <Animated.View style={{
                    flexDirection:'column',
                    height:this.state.animateTopMenuHeight,
                    backgroundColor:this.state.menuBackGroundColor,
                    position:'absolute',
                    top:0,
                    left:0,
                    right:0,
                    justifyContent:'center'
                }}>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity
                            onPress={() =>{this.toBackPage()}}
                            style={{width:44,height:44,justifyContent:'center',alignItems:'center'}}>
                            <Icon name='navigate-before' color={this.state.textColor} iconStyle={{fontSize:30}}/>
                        </TouchableOpacity>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{fontSize:16,color:this.state.textColor}} numberOfLines={1}>{this.state.chapterTitle}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() =>{this.toBookInfo()}}
                            style={{width:44,height:44,justifyContent:'center',alignItems:'center',marginRight:10}}>
                            <Text style={{color:this.state.textColor}}>简介</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
                <Animated.View style={{
                    flexDirection:'row',
                    height:this.state.animateBottomMenuHeight,
                    backgroundColor:this.state.menuBackGroundColor,
                    position:'absolute',
                    bottom:0,
                    left:0,
                    right:0,
                }}>
                    <TouchableOpacity
                        onPress={() =>{this.showChapter()}}
                        style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:5,}}>
                        <Icon name='list' color={this.state.textColor}/>
                        <Text style={{color:this.state.textColor}}>目录</Text>
                    </TouchableOpacity>
                    {this.state.isDay?(
                        <TouchableOpacity
                            onPress={()=>this.toggleDayNight()}
                            style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:5}}>
                            <Icon name='brightness-2' color={this.state.textColor}/>
                            <Text style={{color:this.state.textColor}}>夜间</Text>
                        </TouchableOpacity>
                    ):(
                        <TouchableOpacity
                            onPress={()=>this.toggleDayNight()}
                            style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:5}}>
                            <Icon name='wb-sunny' color={this.state.textColor}/>
                            <Text style={{color:this.state.textColor}}>白天</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={()=>this.toggleFontSizeMenuVisible()}
                        style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:5}}>
                        <Icon name='settings' color={this.state.textColor}/>
                        <Text style={{color:this.state.textColor}}>设置</Text>
                    </TouchableOpacity>
                    {/*<View style={{flex:1,justifyContent:'center',alignItems:'center',marginTop:5}}>*/}
                        {/*<Icon name='file-download' color={this.state.textColor}/>*/}
                        {/*<Text style={{color:this.state.textColor}}>缓存</Text>*/}
                    {/*</View>*/}
                </Animated.View>
                <Animated.View style={{
                    flexDirection:'row',
                    height:this.state.animateFontSizeMenuHeight,
                    backgroundColor:this.state.menuBackGroundColor,
                    position:'absolute',
                    bottom:50,
                    left:0,
                    right:0,
                }}>
                    <TouchableOpacity
                        onPress={() =>{this.deFontSize()}}
                        style={{flex:1,justifyContent:'center',alignItems:'center',margin:10,backgroundColor:this.state.backgroundColor}}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                            <Icon name='text-fields' color={this.state.textColor}/>
                            <Icon name='remove' color={this.state.textColor}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>{this.inFontSize()}}
                        style={{flex:1,justifyContent:'center',alignItems:'center',margin:10,backgroundColor:this.state.backgroundColor}}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                            <Icon name='text-fields' color={this.state.textColor}/>
                            <Icon name='add' color={this.state.textColor}/>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
                <TouchableWithoutFeedback onPress={() => this.hideChapter()}>
                    <Animated.View
                        style={{
                            overflow:'hidden',
                            position:'absolute',
                            top:0,
                            bottom:0,
                            right:0,
                            left:0,
                            width:this.state.animateChapterShadowWidth,
                            justifyContent:'center',
                            alignItems:'center',
                            backgroundColor:'rgba(0,0,0,0.5)',
                        }} >
                    </Animated.View>
                </TouchableWithoutFeedback>

                <Animated.View
                    style={{
                        overflow:'hidden',
                        position:'absolute',
                        top:0,
                        bottom:0,
                        right:0,
                        left:0,
                        width:this.state.animateChapterWidth,
                        justifyContent:'center',
                        backgroundColor:this.state.menuBackGroundColor,
                    }} >
                    <View style={{
                        alignItems:'center',
                        height:80,
                        borderBottomWidth:1/PixelRatio.get(),
                        borderColor:'#000',
                        marginLeft:20,
                        marginRight:15,
                        flexDirection:'row',
                        paddingTop:10,
                        paddingBottom:10
                    }}>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            {typeof(this.props.bookDetail)!== 'undefined'?(
                                <View style={{flexDirection:'row'}}>
                                    <Image
                                        style={styles.itemImage}
                                        source={this.props.bookDetail.cover
                                            ? {uri: (config.IMG_BASE_URL + this.props.bookDetail.cover)}
                                            : require('../../res/default.jpg')}
                                    />
                                    <View style={{flexDirection:'column',flex:1}}>
                                        <Text style={{color:this.state.textColor,flex:1,fontSize:17}} numberOfLines={1}>{this.props.bookDetail.title}</Text>
                                        <Text style={{flex:1,color:this.state.textColor}} numberOfLines={1}>{this.props.bookDetail.author}</Text>
                                    </View>
                                </View>
                            ):(null)}
                        </View>
                        <Icon name="swap-vert" reverse size={30} containerStyle={{height:49,width:49}} color='#1B89EB' onPress={() => this.changeChapterDir()}/>
                    </View>
                    <View style={{flex:1,backgroundColor:this.state.menuBackGroundColor}}>
                        <FlatList
                            ref="chaptersFlatList"
                            ItemSeparatorComponent = {this.renderSeparatorView}
                            initialNumToRender = {10}
                            data={this.state.chapters}
                            keyExtractor={(item, index) => index}
                            renderItem={this.renderChaptersListItem}
                            getItemLayout={(data,index)=>(
                                {length: 50, offset: (50+1/PixelRatio.get()) * index, index}
                            )}
                        />
                    </View>
                </Animated.View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomMenu:{
        flexDirection:'row',
        height:50,
        backgroundColor:'#000',
        position:'absolute',
        bottom:0,
        left:0,
        right:0,
        paddingTop:5,
    },
    itemImage:{
        marginRight: 14,
        alignSelf: 'center',
        width: 40,
        height: 60
    },
});


function select(store: any, props: Props) {
    return {
        bookDetail:store.book.bookDetail,
        mixTocChapters:store.read.mixTocChapters,
        chaptersSourceInvalid:store.read.chaptersSourceInvalid,
        chapter:store.read.chapter,
        loadReadState:store.read.loadReadState,
        ...props
    };
}

export default connect(select)(Read)