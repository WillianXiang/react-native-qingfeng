/**
 * Created by WAN on 2017/9/6.
 */

import React,{Component} from 'react';

import {
    View,
    BackAndroid,
    Navigator,
    StatusBar,
    ScrollView,
    Button,
    Text,
} from 'react-native';

import {
    StackNavigator,
    TabNavigator,
} from 'react-navigation';
import {  Icon,ListItem } from 'react-native-elements';

//Home pages
import Follow from "./pages/home/Follow";
import Community from "./pages/home/Community";
import Find from "./pages/home/Find";
//Find pages
import Rank from "./pages/find/Rank";
import RankDetail from "./pages/find/RankDetail";
import BookGroup from "./pages/find/BookGroup";
import BookGroupDetail from "./pages/find/BookGroupDetail";
import BookSortDetail from  "./pages/find/BookSortDetail";
import BookSearch from "./pages/find/BookSearch";
import BookSearchResult from "./pages/find/BookSearchResult";
//Book detail
import BookInfo from "./pages/book/BookInfo";
import Read from "./pages/book/Read";

//首页的tab
const HomeTabs = TabNavigator({
    Follow:{screen:Follow,
    navigationOptions:({navigation,screenProps}) =>({
        tabBarLabel:'书架',
    })},
    Find:{screen:Find,
        navigationOptions:({navigation,screenProps}) =>({
            tabBarLabel:'书城',
        })}
},{
    tabBarPosition: 'top',
    animationEnabled: true,
    swipeEnabled:true,
    tabBarOptions:{
        style: {
            backgroundColor: '#1B89EB',
        },
        labelStyle: {
            fontSize: 16,
        },
        // activeTintColor: '#1B89EB',
        // activeBackgroundColor:'#fff',
    }
});

const AppNavigator = StackNavigator({
    Home: { screen: HomeTabs,
        navigationOptions:({navigation,screenProps}) => ({
            // StackNavigator 属性部分

            // title:'Test1', 同步设置导航和tabbar文字,不推荐使用
            // headerTitle:'识兔', // 只会设置导航栏文字,
                header:null, // 可以自定义导航条内容，如果需要隐藏可以设置为null
                // headerBackTitle:null, // 设置跳转页面左侧返回箭头后面的文字，默认是上一个页面的标题。可以自定义，也可以设置为null
                // headerTruncatedBackTitle:'', // 设置当上个页面标题不符合返回箭头后的文字时，默认改成"返回"。
                // headerRight:{}, // 设置导航条右侧。可以是按钮或者其他。
                // headerLeft:{}, // 设置导航条左侧。可以是按钮或者其他。
                // headerStyle:{
                //     backgroundColor:'#4ECBFC',
                // }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
            // headerStyle:{
            //     backgroundColor:'#1B89EB',
            // }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
            headerTitleStyle:{
                fontSize:30,
                    color:'white'
            }, // 设置导航条文字样式。安卓上如果要设置文字居中，只要添加alignSelf:'center'就可以了
            // headerBackTitleStyle:{}, // 设置导航条返回文字样式。
            // headerTintColor:'green', // 设置导航栏文字颜色。总感觉和上面重叠了。
            gesturesEnabled:true, // 是否支持滑动返回收拾，iOS默认支持，安卓默认关闭
            swipeEnabled:true,
            animationEnabled:true,
                // TabNavigator 属性部分

                // title:'', 同上
                tabBarVisible:false, // 是否隐藏标签栏。默认不隐藏(true)
            //     tabBarIcon: (({tintColor,focused}) => {
            //     return(
            //         <Image
            //             source={!focused ? ShiTuIcon : ShiTuIcon}
            //             style={[{height:35,width:35 }, {tintColor: tintColor}]}
            //         />
            //     )
            // }), // 设置标签栏的图标。需要单独设置。
                //tabBarLabel:'识兔', // 设置标签栏的title。推荐这个方式。
        })},
    Rank:{screen:Rank,
        navigationOptions:({navigation,screenProps}) => ({
            headerTitle:'排行榜',
            headerStyle:{
                backgroundColor:'#1B89EB',

            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
            headerTitleStyle:{
                alignItems:'center',
                justifyContent:'center'
            }
        })},
    RankDetail:{screen:RankDetail,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    BookGroup:{screen:BookGroup,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    BookGroupDetail:{screen:BookGroupDetail,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    BookSortDetail:{screen:BookSortDetail,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    BookSearch:{screen:BookSearch,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    BookSearchResult:{screen:BookSearchResult,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    BookInfo:{screen:BookInfo,
        navigationOptions:({navigation,screenProps}) => ({
            headerStyle:{
                backgroundColor:'#1B89EB',
            }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
        })},
    Read: {
        screen: Read,
        navigationOptions: ({navigation, screenProps}) => ({
            header:null,
        })
    }}, {
    initialRouteName: 'Home', // 默认显示界面
    navigationOptions: {  // 屏幕导航的默认选项, 也可以在组件内用 static navigationOptions 设置(会覆盖此处的设置)
        gesturesEnabled:true,
        // headerStyle:{
        //     backgroundColor:'#4ECBFC',
        //     paddingTop:54
        // }, // 设置导航条的样式。如果想去掉安卓导航条底部阴影可以添加elevation: 0,iOS去掉阴影是。
    },
    mode: 'card',  // 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
    headerMode: 'screen', // 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
    onTransitionStart: ()=>{ console.log('导航栏切换开始'); },  // 回调
    onTransitionEnd: ()=>{ console.log('导航栏切换结束'); }  // 回调
});

export default AppNavigator;
