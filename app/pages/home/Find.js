/**
 * Created by WAN on 2017/9/8.
 */

import React, { Component } from 'react'
import {
    NetInfo,
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    Modal,
    PixelRatio
} from 'react-native'
import { Icon, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view';
import Toast from 'react-native-root-toast';

import {getRankList} from '../../actions/rank';
import {getBookList,getCategoryList} from '../../actions/book';
import config from '../../config';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Find extends Component {

    constructor(props) {
        super(props);
        this.state = {
            netIsConnected:false,
            maleGender:true,
            rankModalVisible:false,
            bookLists:[],
            maleCategoryList:[],
            femaleCategoryList:[],
            pressCategoryList:[],

            //animate state
            rankModalHeight:new Animated.Value(0),
            rankModalWidth:new Animated.Value(0),
        }
    }

    componentDidMount(){
        this.props.dispatch(getRankList());
        this.props.dispatch(getBookList(1));
        this.props.dispatch(getCategoryList());
        NetInfo.isConnected.fetch().done(
            (isConnected) => { this.setState({netIsConnected:isConnected}); }
        );
        NetInfo.isConnected.addEventListener(
            'change',
            this.connectivityChange
        );
    }

    componentWillReceiveProps(nextProps) {
        if(typeof(this.props.bookLists)!== 'undefined'&&this.state.bookLists.length === 0){
            let booksList = this.props.bookLists;
            this.state.bookLists = booksList.splice(0,2);
        }
        if(typeof(nextProps.categoryList)!== 'undefined'){
            this.state.maleCategoryList = nextProps.categoryList.male;
            this.state.femaleCategoryList = nextProps.categoryList.female;
            this.state.pressCategoryList = nextProps.categoryList.press;
        }
    }

    componentWillUnmount(){
        NetInfo.isConnected.removeEventListener(
            'change',
            this.connectivityChange
        );
    }

    nextNavigate = (navigatePage) =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            navigate(navigatePage)
        }else{
            this.netIsNotConnect();
        }
    };

    toRankDetail = (index) =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            if(typeof(this.props.rankList) !== 'undefined'){
                if(this.state.maleGender){
                    navigate('RankDetail',this.props.rankList.male[index]);
                }else{
                    navigate('RankDetail',this.props.rankList.female[index]);
                }
            }
        }else{
            this.netIsNotConnect();
        }
    };

    toRankDetailByAll = (gender,index) =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            if(typeof(this.props.rankList) !== 'undefined'){
                this.toggleRankModal();
                if(gender === 1){
                    navigate('RankDetail',this.props.rankList.male[index]);
                }else{
                    navigate('RankDetail',this.props.rankList.female[index]);
                }
            }
        }else{
            this.netIsNotConnect();
        }
    };

    toBookGroup = () =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            navigate('BookGroup');
        }else{
            this.netIsNotConnect();
        }
    };

    toBookGroupDetail = (id,groupTitle) =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            navigate('BookGroupDetail',{bookListId:id,bookListTitle:groupTitle});
        }else{
            this.netIsNotConnect();
        }
    };

    toBookSortDetail  = (index,majorName) =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            if(index === 1){
                let minsTemp = this.props.categoryListV2.male.filter((item,index)=>{ return item.major == majorName});
                navigate('BookSortDetail',{major:majorName,mins:minsTemp,gender:'male'});
            }else if(index === 2){
                let minsTemp = this.props.categoryListV2.female.filter((item,index)=>{ return item.major == majorName});
                navigate('BookSortDetail',{major:majorName,mins:minsTemp,gender:'female'});
            }else if(index === 3){
                // let minsTemp = this.props.categoryListV2.press.filter((item,index)=>{ return item.major == majorName});
                navigate('BookSortDetail',{major:majorName,gender:'press'});
            }
        }else{
            this.netIsNotConnect();
        }
    };

    toBookSearch = () =>{
        if(this.state.netIsConnected){
            const { navigate } = this.props.navigation;
            navigate('BookSearch');
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

    toggleRankModal = () =>{
        if(this.state.rankModalVisible){
            // this.closeRankModal();
            this.setState({rankModalVisible:false})
        }else{
            // this.openRankModal();
            this.setState({rankModalVisible:true})
        }
    };

    changeGenderSelect = () =>{
        this.setState({maleGender:!this.state.maleGender})
    };

    renderFindItem = (item) =>{
        let rowData = item.item;
        let index =item.index;
        return (
            <ListItem
                key={index}
                title={rowData.title}
                leftIcon={{name: rowData.iconName}}
                onPress ={() => this.nextNavigate(rowData.navigatePage)}
            />
        )
    };

    renderRankInfo = () =>{
        return(
            <View>
                <View style={styles.titleView}>
                    <Text style={styles.titleLeftText}>榜单</Text>
                    <View style={styles.titleMiddleView}/>
                    <Text onPress={()=>this.toggleRankModal()} style={styles.titleRightText}>查看全部</Text>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',height:44}}>
                    {this.state.maleGender?(
                        <TouchableOpacity onPress={()=>this.changeGenderSelect()} style={{flexDirection:'row',width:88,height:44,borderRadius:22,backgroundColor:'#fff'}}>
                            <View style={{height:44,width:44,backgroundColor:'#2586F1',borderRadius:22,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:18}}>男</Text>
                            </View>
                            <View style={{height:44,width:44,borderRadius:22,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#000',fontSize:18}}>女</Text>
                            </View>
                        </TouchableOpacity>
                    ):(
                        <TouchableOpacity onPress={()=>this.changeGenderSelect()} style={{flexDirection:'row',width:88,height:44,borderRadius:22,backgroundColor:'#fff'}}>
                            <View style={{height:44,width:44,borderRadius:22,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#000',fontSize:18}}>男</Text>
                            </View>
                            <View style={{height:44,width:44,backgroundColor:'#F17BA9',borderRadius:22,justifyContent:'center',alignItems:'center'}}>
                                <Text style={{color:'#fff',fontSize:18}}>女</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                    <TouchableOpacity onPress={()=>this.toRankDetail(0)} style={[styles.rankItem,{backgroundColor:'#2586F1'}]}>
                        <Text style={styles.rankItemText}>人 气 榜</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.toRankDetail(1)} style={[styles.rankItem,{backgroundColor:'#2586F1'}]}>
                        <Text style={styles.rankItemText}>潜 力 榜</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.toRankDetail(2)} style={[styles.rankItem,{backgroundColor:'#2586F1'}]}>
                        <Text style={styles.rankItemText}>留 存 榜</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.toRankDetail(3)} style={[styles.rankItem,{backgroundColor:'#2586F1'}]}>
                        <Text style={styles.rankItemText}>完 结 榜</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

    renderGroupInfoItem = (rowData) =>{
        let groupTitle = rowData.item.title;
        let groupId = rowData.item._id;
        let desc = rowData.item.desc;
        let cover = rowData.item.cover;
        let bookCount = rowData.item.bookCount;
        return(
            <TouchableOpacity
                onPress={()=>this.toBookGroupDetail(groupId,groupTitle)}
                style={[styles.item]}>
                <View style={styles.itemTitle}>
                    <Text numberOfLines={2} style={styles.itemTitleText}>{groupTitle}</Text>
                </View>
                <View style={styles.itemContent}>
                    <Text numberOfLines={3} style={styles.itemContentText}>{desc}</Text>
                    {/*<Text numberOfLines={1} style={styles.itemContentText}>精进：成为一个很厉害的人</Text>*/}
                    {/*<Text numberOfLines={1} style={styles.itemContentText}>番茄工作法图解：简单易行的时间管理方法</Text>*/}
                </View>
                <View style={styles.itemFooter}>
                    <Text style={styles.itemFooterText}>{bookCount}本书</Text>
                </View>
            </TouchableOpacity>
        )
    };



    renderMaleRank = () =>{
        let maleRankList = typeof(this.props.rankList.male)!== 'undefined'?this.props.rankList.male:[];
        if(maleRankList.length>0){
            return(
                    <FlatList
                        initialNumToRender = {5}
                        data={maleRankList}
                        renderItem={this.renderMaleRankItem}
                        keyExtractor={(item, index) => index}
                    />
                )
        }
    };

    renderFemaleRank = () =>{
        let femaleRankList = typeof(this.props.rankList.male)!== 'undefined'?this.props.rankList.female:[];
        if(femaleRankList.length>0){
            return(
                <FlatList
                    initialNumToRender = {5}
                    data={femaleRankList}
                    renderItem={this.renderFemaleRankItem}
                    keyExtractor={(item, index) => index}
                />
            )
        }
    };

    renderMaleRankItem = (item) =>{
        let rowData = item.item;
        let coverUrl = rowData.cover;
        let title = rowData.title;
        let index =item.index;
        return (
            <TouchableOpacity onPress={()=>this.toRankDetailByAll(1,index)} style={styles.rankModalView}>
                <ListItem
                    roundAvatar
                    key={index}
                    title={title}
                    avatar={coverUrl
                        ? {uri: (config.IMG_BASE_URL + coverUrl)}
                        : require('../../res/default.jpg')}
                />
            </TouchableOpacity>
        )
    };

    renderFemaleRankItem = (item) =>{
        let rowData = item.item;
        let coverUrl = rowData.cover;
        let title = rowData.title;
        let index =item.index;
        return (
            <TouchableOpacity onPress={()=>this.toRankDetailByAll(2,index)} style={styles.rankModalView}>
                <ListItem
                    roundAvatar
                    key={index}
                    title={title}
                    avatar={coverUrl
                        ? {uri: (config.IMG_BASE_URL + coverUrl)}
                        : require('../../res/default.jpg')}
                />
            </TouchableOpacity>
        )
    };

    renderMaleCategoryListItem = (rowData) =>{
        let name = rowData.item.name;
        let bookCount = rowData.item.bookCount;
        return (
            <TouchableOpacity
                onPress={()=>this.toBookSortDetail(1,name)}
                style={{justifyContent:'center',alignItems:'center',flexDirection:'column',flex:1,backgroundColor:'#fff',padding:10}}>
                <Text style={{fontSize:18,color:'#000'}}>{name}</Text>
                <Text>{bookCount}</Text>
            </TouchableOpacity>
        )
    };

    renderFemaleCategoryListItem = (rowData) =>{
        let name = rowData.item.name;
        let bookCount = rowData.item.bookCount;
        return (
            <TouchableOpacity
                onPress={()=>this.toBookSortDetail(2,name)}
                style={{justifyContent:'center',alignItems:'center',flexDirection:'column',flex:1,backgroundColor:'#fff',padding:10}}>
                <Text style={{fontSize:18,color:'#000'}}>{name}</Text>
                <Text>{bookCount}</Text>
            </TouchableOpacity>
        )
    };

    renderPressCategoryListItem = (rowData) =>{
        let name = rowData.item.name;
        let bookCount = rowData.item.bookCount;
        return (
            <TouchableOpacity
                onPress={()=>this.toBookSortDetail(3,name)}
                style={{justifyContent:'center',alignItems:'center',flexDirection:'column',flex:1,backgroundColor:'#fff',padding:10}}>
                <Text style={{fontSize:18,color:'#000'}}>{name}</Text>
                <Text>{bookCount}</Text>
            </TouchableOpacity>
        )
    };

    render() {
        return (
            <View>
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <TouchableOpacity
                        onPress={()=>this.toBookSearch()}>
                        <View style={{height:44,marginLeft:15,marginRight:15,marginTop:10,paddingLeft:10,alignItems:'flex-start',backgroundColor:'#fff',borderRadius:10,justifyContent:'center'}}>
                            <Icon name='search' color='#1B89EB' iconStyle={{fontSize:30}}/>
                        </View>
                    </TouchableOpacity>
                    {this.renderRankInfo()}
                    <View>
                        <View style={styles.titleView}>
                            <Text style={styles.titleLeftText}>专题</Text>
                            <View style={styles.titleMiddleView}/>
                            <TouchableOpacity onPress={()=>this.toBookGroup()}>
                                <Text style={styles.titleRightText}>查看全部</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                            <FlatList
                                initialNumToRender = {2}
                                data={this.state.bookLists}
                                numColumns={2}
                                renderItem={this.renderGroupInfoItem}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                    </View>

                    <View>
                        <View style={styles.titleView}>
                            <Text style={styles.titleLeftText}>分类</Text>
                            <View style={styles.titleMiddleView}/>
                        </View>
                        <View style={{height:70,backgroundColor:'#2586F1',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',marginLeft:15,marginRight:15}}>
                            <View style={styles.titleMiddleView}/>
                            <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>男 生</Text>
                            <View style={styles.titleMiddleView}/>
                        </View>
                        <View style={{flexDirection:'row',flexWrap:'wrap',marginLeft:15,marginRight:15,marginBottom:30,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                            <FlatList
                                initialNumToRender = {2}
                                data={this.state.maleCategoryList}
                                numColumns={3}
                                renderItem={this.renderMaleCategoryListItem}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                        <View style={{height:70,backgroundColor:'#2586F1',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',marginLeft:15,marginRight:15}}>
                            <View style={styles.titleMiddleView}/>
                            <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>女 生</Text>
                            <View style={styles.titleMiddleView}/>
                        </View>
                        <View style={{flexDirection:'row',flexWrap:'wrap',marginLeft:15,marginRight:15,marginBottom:30,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                            <FlatList
                                initialNumToRender = {2}
                                data={this.state.femaleCategoryList}
                                numColumns={3}
                                renderItem={this.renderFemaleCategoryListItem}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                        <View style={{height:70,backgroundColor:'#2586F1',borderTopLeftRadius:10,borderTopRightRadius:10,alignItems:'center',marginLeft:15,marginRight:15}}>
                            <View style={styles.titleMiddleView}/>
                            <Text style={{fontSize:20,color:'#fff',fontWeight:'bold'}}>出 版</Text>
                            <View style={styles.titleMiddleView}/>
                        </View>
                        <View style={{flexDirection:'row',flexWrap:'wrap',marginLeft:15,marginRight:15,marginBottom:30,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
                            <FlatList
                                initialNumToRender = {2}
                                data={this.state.pressCategoryList}
                                numColumns={3}
                                renderItem={this.renderPressCategoryListItem}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                    </View>
                    <View style={{height:20,justifyContent:'center',alignItems:'center',flexDirection:'row',marginLeft:15,marginRight:15,marginBottom:30}}>
                        <View style={{flex:1,height:1/PixelRatio.get(),}}/>
                        <Text> 没有更多啦 </Text>
                        <View style={{flex:1,height:1/PixelRatio.get(),}}/>
                    </View>
                </ScrollView>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.rankModalVisible}
                    onRequestClose={() => this.toggleRankModal()}
                >
                    <TouchableWithoutFeedback
                        onPress={()=>this.toggleRankModal()}>
                        <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                            <View style={{flex:1,margin:50,backgroundColor:'#fff',borderRadius:5}}>
                                <ScrollableTabView
                                    renderTabBar={() => <DefaultTabBar/>}>
                                    <View tabLabel='男生榜'>
                                        {this.renderMaleRank()}
                                    </View>
                                    <View tabLabel='女生榜'>
                                        {this.renderFemaleRank()}
                                    </View>
                                </ScrollableTabView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerIcon: {
        marginLeft: 14,
        marginRight: 14
    },
    rankItem:{
        width:SCREEN_WIDTH/2-20,
        margin:10,
        height:70,
        justifyContent:'center',
        alignItems:'center'
    },
    rankItemText:{
        color:'#fff',
        fontSize:22,
        fontWeight:'bold',
    },
    item:{
        width:SCREEN_WIDTH/2-20,
        margin:10,
        paddingLeft:15,
        paddingRight:15,
        paddingBottom:5,
        height:240,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#fff'
    },
    itemTitle:{
        height:70,
        backgroundColor:'#2586F1',
        width:SCREEN_WIDTH/2-20,
        justifyContent:'center',
        borderTopRightRadius:10,
        borderTopLeftRadius:10,
        paddingLeft:15,
        paddingRight:15
    },
    itemTitleText:{
        color:'#fff'
    },
    itemContent:{
        flex:1,
        justifyContent:'center',
    },
    itemContentText:{
        marginTop:5,
        marginBottom:5,
        color:'#000'
    },
    itemFooter:{
        height:20,
        width:SCREEN_WIDTH/2-20,
        justifyContent:'center',
        paddingLeft:15,
        marginBottom:15
    },
    itemFooterText:{

    },
    titleView:{
        height:40,
        paddingLeft:15,
        paddingRight:15,
        justifyContent:'center',
        flexDirection:'row',
        marginTop:30
    },
    titleLeftText:{
        color:'#000',
        fontSize:20
    },
    titleRightText:{
        color:'#2A71FF',
        fontSize:15
    },
    titleMiddleView:{
        flex:1
    },
    rankModalView:{
        paddingLeft:20,
        paddingRight:20
    },
    rankModalText:{
        color:'#000',
    }
});

function select(store: any, props: Props) {
    return {
        rankList:store.rank.rankList,
        bookLists:store.book.bookLists,
        categoryList:store.book.categoryList,
        categoryListV2:store.book.categoryListV2,
        ...props
    };
}

export default connect(select)(Find)