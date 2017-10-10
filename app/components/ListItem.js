/**
 * Created by WAN on 2017/9/8.
 */
'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Dimensions,
    View,
    Text,
    Image,
    Alert,
} from 'react-native';

import Icon from "react-native-vector-icons/FontAwesome";

const SCREEN_WIDTH = Dimensions.get('window').width;

class ListItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    toCourse = () => {
        if (!this.props.toCourse) {
            return;
        }

        this.props.toCourse();
    };

    render() {
        return (
            <View style={styles.container}>
                <Icon name={this.props.rowData.iconName} size={30} style={{color:"blue"}}/>
                <View>
                    <Text>{this.props.rowData.title}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'row',
    },
});

export default ListItem;