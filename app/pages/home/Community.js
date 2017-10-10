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
    Button
} from 'react-native'

export default class Community extends Component {

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    这是社区
                </Text>

                <Button
                    title="这是社区"
                    onPress={() =>
                        navigate('Profile', { name: 'Jane' })
                    }
                />

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
    }
});