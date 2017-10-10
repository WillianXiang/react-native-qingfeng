/**
 * Created by WAN on 2017/9/28.
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    View,
    Text,
    Image,
    Modal,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<StatusBar translucent={false} hidden={true}/>*/}
                {/*<Modal*/}
                    {/*animationType={"slide"}*/}
                    {/*transparent={true}*/}
                    {/*visible={true}*/}
                    {/*onRequestClose={() => {}}*/}
                {/*>*/}
                    <View style={{flex:1,backgroundColor:'rgba(0, 0, 0, 0)',justifyContent:'center',alignItems:'center'}}>
                        <Image
                            style={styles.itemImage}
                            source={require('../res/dog_loading.gif')}
                        />
                        {/*<View style={{width:200,height:100,margin:50,backgroundColor:'#fff',borderRadius:10,justifyContent:'center',alignItems:'center'}}>*/}
                            {/*<Text style={{fontSize:20,color:'#000'}}>拼命加载中...</Text>*/}
                        {/*</View>*/}
                    </View>
                {/*</Modal>*/}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection:'row',
        height:SCREEN_HEIGHT,
        width:SCREEN_WIDTH,
    },
    itemImage: {
        alignSelf: 'center',
        width: 200,
        height: 200,
        borderRadius:100
    },
});

export default Loading;