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
import {Provider} from 'react-redux';
import Storage from 'react-native-storage';
import Realm from 'realm';
import schemaArray from './util/modelSchema';
import configureStore from './store/store';

import App from './app';

global.realm = new Realm({schema: schemaArray});

class rootApp extends Component {
    render(){
        return(
            <Provider store={configureStore}>
                <View style={{flex:1,}}>
                    <StatusBar translucent={false} backgroundColor="#1B89EB"  barStyle='light-content'/>
                    <App />
                </View>
            </Provider>
        );
    }
}

export default rootApp